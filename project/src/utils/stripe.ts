import { loadStripe } from '@stripe/stripe-js';

// Remplacez par votre clé publique Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_votreClePubliqueStripe');

export default stripePromise;