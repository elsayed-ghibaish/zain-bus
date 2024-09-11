import React from "react";
import { startWalletProcess } from "paymob-react"; // Import the startWalletProcess function

function WalletPaymentExample() {
  // Define payment details for wallet payment
  const walletPaymentDetails = {
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
    walletIntegrationId: 1996357, // Replace with the ID of your wallet integration
    iframeId: 369734, // Replace with the ID of your iframe
    mobileNumber: "01010101010", // Replace with the mobile number associated with the wallet
  };

  // Function to handle wallet payment
  const handleWalletPayment = async () => {
    try {
      // Start the wallet payment process
      await startWalletProcess(
        walletPaymentDetails.amount,
        walletPaymentDetails.currency,
        walletPaymentDetails.courseTitle,
        walletPaymentDetails.courseDescription,
        walletPaymentDetails.firstName,
        walletPaymentDetails.lastName,
        walletPaymentDetails.email,
        walletPaymentDetails.phoneNumber,
        walletPaymentDetails.userId,
        walletPaymentDetails.courseId,
        walletPaymentDetails.paymobApiKey,
        walletPaymentDetails.walletIntegrationId,
        walletPaymentDetails.iframeId,
        walletPaymentDetails.mobileNumber
      );
      console.log("Wallet payment process started successfully.");
    } catch (error) {
      console.error("Error starting wallet payment process:", error);
    }
  };

  return (
    <div>
      <h1>Wallet Payment Example</h1>
      <button onClick={handleWalletPayment}>Start Wallet Payment</button>
    </div>
  );
}

export default WalletPaymentExample;