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
      iconColor: "#4F46E5",
      color: "#1F2937",
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
  const {membershipid} = useParams();
  const [cardError, setCardError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const {user} = UseAuthHook();
  const navigate = useNavigate();


  const {isPending, data: plansInfo = {}} = useQuery({
    queryKey: ["membershipplans", membershipid],
    queryFn: async () => {
        const res = await axios.get(`https://code-circle-server-three.vercel.app/membershipplans/${membershipid}`)
        return res.data
    }
  })

  if(isPending){
    return <Loader></Loader>
  }

  

  const amount = parseFloat(plansInfo.cost) 
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
      // 🚀 optionally send `paymentMethod.id` to backend here
    }

    const res = await axios.post('https://code-circle-server-three.vercel.app/create-payment-intent', {
        amountInCents,
        membershipid,
    })


    const clientSecret = res.data.clientSecret

    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
                name: user?.displayName,
                email: user?.email,
                
            }
        }
    })

    if(result.error){
        console.log(result.error.message);
        toast.error("Payment Failed")
    } else {
        if(result.paymentIntent.status === "succeeded") {
            toast.success("Payment Completed")
            console.log(result);
            const paymentData = {
              userEmail: user?.email,
              userId: user?.uid,
              planId: membershipid,
              planTitle: plansInfo?.title,
              amount: amountInCents,
              currency: "USD",
              transactionId: result.paymentIntent.id,
            }
            const paymentRes = await axios.post('https://code-circle-server-three.vercel.app/payments', paymentData)
            if(paymentRes.data.insertedId){
              console.log("logged saved");
              setTimeout(() => navigate("/"), 2000);
            }
        }
    }
    
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-xl border">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enter Card Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border rounded-xl p-4">
          <CardElement options={CARD_OPTIONS} />
        </div>

        {cardError && (
          <div className="flex items-center text-red-600 gap-2 text-sm">
            <FaExclamationCircle /> {cardError}
          </div>
        )}

        {success && (
          <div className="flex items-center text-green-600 gap-2 text-sm">
            <FaCheckCircle /> {success}
          </div>
        )}

        <p className='font-bold'>Your Total Bills : {amount}</p>

        <button
          type="submit"
          disabled={!stripe || loading}
          className={`w-full py-2 px-4 text-white font-medium rounded-xl transition ${
            loading || !stripe
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
