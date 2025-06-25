import express from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { validateMessage } from '../middleware/validation.js';

const router = express.Router();

// @desc    Obtenir les conversations de l'utilisateur
// @route   GET /api/messages/conversations
// @access  Private
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await Message.getConversations(req.user.id);

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    console.error('Erreur récupération conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des conversations'
    });
  }
});

// @desc    Obtenir les messages d'une conversation
// @route   GET /api/messages/:userId
// @access  Private
router.get('/:userId', protect, async (req, res) => {
  try {
    const otherUser = await User.findById(req.params.userId);
    
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Récupérer les messages entre les deux utilisateurs
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user.id }
      ],
      isDeleted: false
    })
    .sort({ createdAt: 1 })
    .populate('sender', 'name avatar role')
    .populate('recipient', 'name avatar role')
    .populate('course', 'title');

    // Marquer les messages non lus comme lus
    const unreadMessages = messages.filter(
      message => 
        message.recipient._id.toString() === req.user.id && 
        !message.isRead
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        {
          recipient: req.user.id,
          sender: req.params.userId,
          isRead: false
        },
        {
          isRead: true,
          readAt: new Date()
        }
      );
    }

    res.json({
      success: true,
      data: {
        messages,
        participant: {
          id: otherUser._id,
          name: otherUser.name,
          avatar: otherUser.avatar,
          role: otherUser.role
        }
      }
    });
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages'
    });
  }
});

// @desc    Envoyer un message
// @route   POST /api/messages
// @access  Private
router.post('/', protect, validateMessage, async (req, res) => {
  try {
    const { recipient, content, course, type = 'text', fileUrl, fileName, fileSize } = req.body;

    // Vérifier que le destinataire existe
    const recipientUser = await User.findById(recipient);
    
    if (!recipientUser) {
      return res.status(404).json({
        success: false,
        message: 'Destinataire non trouvé'
      });
    }

    // Créer le message
    const message = await Message.create({
      sender: req.user.id,
      recipient,
      content,
      course,
      type,
      fileUrl,
      fileName,
      fileSize
    });

    // Populer les champs pour la réponse
    await message.populate('sender', 'name avatar role');
    await message.populate('recipient', 'name avatar role');
    if (course) {
      await message.populate('course', 'title');
    }

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: message
    });
  } catch (error) {
    console.error('Erreur envoi message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message'
    });
  }
});

// @desc    Marquer un message comme lu
// @route   PUT /api/messages/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    // Vérifier que l'utilisateur est bien le destinataire
    if (message.recipient.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à marquer ce message comme lu'
      });
    }

    if (!message.isRead) {
      message.isRead = true;
      message.readAt = new Date();
      await message.save();
    }

    res.json({
      success: true,
      message: 'Message marqué comme lu',
      data: message
    });
  } catch (error) {
    console.error('Erreur marquage message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage du message'
    });
  }
});

// @desc    Supprimer un message
// @route   DELETE /api/messages/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    // Vérifier que l'utilisateur est l'expéditeur ou le destinataire
    if (
      message.sender.toString() !== req.user.id &&
      message.recipient.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à supprimer ce message'
      });
    }

    // Marquer comme supprimé au lieu de supprimer réellement
    message.isDeleted = true;
    message.deletedAt = new Date();
    message.deletedBy = req.user.id;
    await message.save();

    res.json({
      success: true,
      message: 'Message supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression message:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du message'
    });
  }
});

// @desc    Obtenir le nombre de messages non lus
// @route   GET /api/messages/unread/count
// @access  Private
router.get('/unread/count', protect, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      recipient: req.user.id,
      isRead: false,
      isDeleted: false
    });

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    console.error('Erreur comptage messages non lus:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du comptage des messages non lus'
    });
  }
});

export default router;