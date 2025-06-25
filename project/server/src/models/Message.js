import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'expéditeur est requis']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le destinataire est requis']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId
  },
  content: {
    type: String,
    required: [true, 'Le contenu du message est requis'],
    trim: true,
    maxlength: [2000, 'Le message ne peut pas dépasser 2000 caractères']
  },
  type: {
    type: String,
    enum: ['text', 'file', 'image', 'video'],
    default: 'text'
  },
  fileUrl: {
    type: String,
    trim: true
  },
  fileName: {
    type: String,
    trim: true
  },
  fileSize: {
    type: Number
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deletedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour les performances
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ course: 1 });
messageSchema.index({ createdAt: -1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ isDeleted: 1 });

// Index composé pour les conversations
messageSchema.index({ 
  sender: 1, 
  recipient: 1, 
  createdAt: -1 
});

// Virtual pour obtenir l'ID de conversation
messageSchema.virtual('conversationId').get(function() {
  const ids = [this.sender.toString(), this.recipient.toString()].sort();
  return ids.join('-');
});

// Méthode pour marquer comme lu
messageSchema.methods.markAsRead = function(userId) {
  if (this.recipient.toString() === userId.toString() && !this.isRead) {
    this.isRead = true;
    this.readAt = new Date();
    return this.save();
  }
  return Promise.resolve(this);
};

// Méthode pour ajouter une réaction
messageSchema.methods.addReaction = function(userId, emoji) {
  // Supprimer la réaction existante de cet utilisateur
  this.reactions = this.reactions.filter(
    reaction => reaction.user.toString() !== userId.toString()
  );
  
  // Ajouter la nouvelle réaction
  this.reactions.push({
    user: userId,
    emoji
  });
  
  return this.save();
};

// Méthode pour supprimer une réaction
messageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(
    reaction => reaction.user.toString() !== userId.toString()
  );
  
  return this.save();
};

// Méthode pour éditer le message
messageSchema.methods.editContent = function(newContent) {
  // Sauvegarder l'ancien contenu dans l'historique
  if (this.content !== newContent) {
    this.editHistory.push({
      content: this.content,
      editedAt: new Date()
    });
    
    this.content = newContent;
    this.isEdited = true;
  }
  
  return this.save();
};

// Méthode statique pour obtenir les conversations d'un utilisateur
messageSchema.statics.getConversations = async function(userId) {
  const conversations = await this.aggregate([
    {
      $match: {
        $or: [
          { sender: mongoose.Types.ObjectId(userId) },
          { recipient: mongoose.Types.ObjectId(userId) }
        ],
        isDeleted: false
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: {
          $cond: {
            if: { $eq: ['$sender', mongoose.Types.ObjectId(userId)] },
            then: '$recipient',
            else: '$sender'
          }
        },
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: {
              if: {
                $and: [
                  { $eq: ['$recipient', mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$isRead', false] }
                ]
              },
              then: 1,
              else: 0
            }
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'participant'
      }
    },
    {
      $unwind: '$participant'
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'lastMessage.course',
        foreignField: '_id',
        as: 'course'
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);

  return conversations;
};

export default mongoose.model('Message', messageSchema);