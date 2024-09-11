import React from "react";
import { startCardProcess } from "paymob-react"; // Import the startCardProcess function

function CardPaymentExample() {
  // Define payment details for card payment
  const paymentDetails = {
    amount: 1000, // Replace with the amount in your currency (e.g., 1000 for 10.00 EGP)
    currency: "EGP", // Replace with your currency code (e.g., "EGP" for Egyptian Pound)
    courseTitle: "Product Name", // Replace with the name of your product or course
    courseDescription: "Description of the product", // Replace with the description of your product or course
    firstName: "John", // Replace with the first name of the customer
    lastName: "Doe", // Replace with the last name of the customer
    email: "john.doe@example.com", // Replace with the email address of the customer
    phoneNumber: "+1234567890", // Replace with the phone number of the customer (including country code)
    userId: 123456, // Replace with a unique identifier for the customer (e.g., user ID)
    courseId: 789012, // Replace with a unique identifier for the course or product
    paymobApiKey: "your_paymob_api_key", // Replace with your Paymob API key
    cardIntegrationId: 1984360, // Replace with the ID of your card integration
    iframeId: 369734, // Replace with the ID of your iframe
  };

  // Function to handle card payment
  const handleCardPayment = async () => {
    try {
      // Start the card payment process
      await startCardProcess(
        paymentDetails.amount,
        paymentDetails.currency,
        paymentDetails.courseTitle,
        paymentDetails.courseDescription,
        paymentDetails.firstName,
        paymentDetails.lastName,
        paymentDetails.email,
        paymentDetails.phoneNumber,
        paymentDetails.userId,
        paymentDetails.courseId,
        paymentDetails.paymobApiKey,
        paymentDetails.cardIntegrationId,
        paymentDetails.iframeId
      );
      console.log("Card payment process started successfully.");
    } catch (error) {
      console.error("Error starting card payment process:", error);
    }
  };

  return (
    <div>
      <h1>Card Payment Example</h1>
      <button onClick={handleCardPayment}>Start Card Payment</button>
    </div>
  );
}

export default CardPaymentExample;