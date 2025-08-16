import React, { useState } from 'react';
import {
  CardElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loader from '../../../components/Loader/Loader';
import toast from 'react-hot-toast';
import UseAuthHook from '../../../hooks/contexthooks/UseAuthHook';

const CARD_OPTIONS = {
  style: {
    base: {
      iconColor: "#A5B4FC",
      color: "#E5E7EB",
      fontWeight: 500,
      fontFamily: "Inter, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
    invalid: {
      iconColor: "#EF4444",
      color: "#EF4444",
    },
  },
};

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { membershipid } = useParams();
  const [cardError, setCardError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = UseAuthHook();
  const navigate = useNavigate();

  const { isPending, data: plansInfo = {} } = useQuery({
    queryKey: ["membershipplans", membershipid],
    queryFn: async () => {
      const res = await axios.get(`https://code-circle-server-three.vercel.app/membershipplans/${membershipid}`);
      return res.data;
    }
  });

  if (isPending) {
    return <Loader />;
  }

  const amount = parseFloat(plansInfo.cost);
  const amountInCents = amount * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCardError('');
    setSuccess('');
    setLoading(true);

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card
    });

    if (error) {
      console.error("Stripe error:", error);
      setCardError(error.message);
    } else {
      console.log("💳 Payment Method:", paymentMethod);
      setSuccess("Payment method created successfully!");
    }

    const res = await axios.post('https://code-circle-server-three.vercel.app/create-payment-intent', {
      amountInCents,
      membershipid,
    });

    const clientSecret = res.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: user?.displayName,
          email: user?.email,
        }
      }
    });

    if (result.error) {
      console.log(result.error.message);
      toast.error("Payment Failed");
    } else {
      if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment Completed");
        console.log(result);
        const paymentData = {
          userEmail: user?.email,
          userId: user?.uid,
          planId: membershipid,
          planTitle: plansInfo?.title,
          amount: amountInCents,
          currency: "USD",
          transactionId: result.paymentIntent.id,
        };
        const paymentRes = await axios.post('https://code-circle-server-three.vercel.app/payments', paymentData);
        if (paymentRes.data.insertedId) {
          console.log("logged saved");
          setTimeout(() => navigate("/dashboard/profile"), 1000);
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto  min-h-screen flex items-center justify-center p-4">
      <div className="w-full bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all duration-300 relative overflow-hidden">
        {/* Glowing effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        
        <h2 className="text-2xl font-semibold text-white mb-4 drop-shadow-lg relative z-10">Enter Card Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div className="border border-white/20 rounded-xl p-4 bg-white/5 backdrop-blur-sm">
            <CardElement options={CARD_OPTIONS} />
          </div>

          {cardError && (
            <div className="flex items-center text-red-500 gap-2 text-sm">
              <FaExclamationCircle /> {cardError}
            </div>
          )}

          {success && (
            <div className="flex items-center text-indigo-300 gap-2 text-sm">
              <FaCheckCircle /> {success}
            </div>
          )}

          <p className="font-bold text-white">Your Total Bill: ${amount.toFixed(2)}</p>

          <button
            type="submit"
            disabled={!stripe || loading}
            className={`w-full py-2 px-4 text-white font-medium rounded-xl transition-all duration-300 ${
              loading || !stripe
                ? 'bg-gray-500/50 cursor-not-allowed backdrop-blur-sm'
                : 'bg-gradient-to-r from-indigo-500  to-purple-600 hover:from-indigo-600 hover:to-purple-700 cursor-pointer'
            }`}
          >
            {loading ? 'Processing...' : 'Pay'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;