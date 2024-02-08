import { supabase } from "../config/supabase.js";
import midtransClient from 'midtrans-client';

import dotenv from "dotenv";

dotenv.config();

// Initialize Midtrans client
let snap = new midtransClient.Snap({
  isProduction : false, // Set to true in production
  serverKey : process.env.MIDTRANS_SERVER_KEY
});

class PackageController {
  static async getPackages(req, res, next) {
    try {
        const { data, error } = await supabase
            .from("packages")
            .select("*"); // Select all columns from the 'packages' table

        if (error) {
            throw error;
        }

        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
  }

  static async getPackagePurchaseLink(req, res, next) {
    try {
        const user_id = req.user;
        const package_id = req.query.package_id;

        // Fetch package details
        const { data: packageData, error: packageError } = await supabase
            .from("packages")
            .select()
            .eq("id", package_id)
            .single();

        if (packageError) {
            throw packageError;
        }

        // Insert a new transaction record
        const { data: transactionData, error: transactionError } = await supabase
            .from("transactions")
            .insert([{ user_id: user_id, package_id: package_id }])
            .single();


        if (transactionError) {
            throw transactionError;
        }
        console.log(transactionData, "transactionData.id")
        // Prepare transaction data for Midtrans
        let parameter = {
            "transaction_details": {
                "order_id": transactionData.id, // Use the transaction UUID
                "gross_amount": packageData.price
            },
            "customer_details": {
                "id": user_id
            }
        };

        // Create transaction token
        snap.createTransaction(parameter)
            .then((transaction) => {
                res.status(200).json({ 
                    token: transaction.token,
                    redirectUrl: transaction.redirect_url
                });
            });
    } catch (err) {
        next(err);
    }
  }

  static async postPackagePurchaseWebhook(req, res, next) {
    try {
        const transactionData = req.body;
        const orderId = transactionData.order_id;
        const transactionStatus = transactionData.transaction_status;

        // Fetch the transaction to get user ID and package ID
        const { data: transaction, error: transactionError } = await supabase
            .from("transactions")
            .select("user_id, package_id")
            .eq("id", orderId)
            .single();

        if (transactionError || !transaction) {
            throw transactionError || new Error("Transaction not found");
        }

        // Process transaction based on its status
        if (transactionStatus === 'settlement' || transactionStatus === 'capture') {
            // Update the transaction as paid
            const { error: paymentUpdateError } = await supabase
                .from("transactions")
                .update({ paid: true })
                .eq("id", orderId);

            if (paymentUpdateError) {
                throw paymentUpdateError;
            }

            // Fetch package duration from the 'packages' table
            const { data: packageData, error: packageError } = await supabase
                .from("packages")
                .select("duration")
                .eq("id", transaction.package_id)
                .single();

            if (packageError) {
                throw packageError;
            }

            // Fetch current package duration for the user
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("package_duration")
                .eq("id", transaction.user_id)
                .single();

            if (userError) {
                throw userError;
            }

            let newPackageDuration;
            if (userData.package_duration) {
                // Use existing package duration as the start date
                newPackageDuration = new Date(new Date(userData.package_duration).getTime() + packageData.duration * 24 * 60 * 60 * 1000);
            } else {
                // Use current date as the start date
                newPackageDuration = new Date(new Date().getTime() + packageData.duration * 24 * 60 * 60 * 1000);
            }

            // Update user's package status and duration in your database
            const { error: userUpdateError } = await supabase
                .from("users")
                .update({
                    package_id: transaction.package_id,
                    package_duration: newPackageDuration.toISOString(),
                    is_premium: true
                })
                .eq("id", transaction.user_id);

            if (userUpdateError) {
                throw userUpdateError;
            }
        }

        // Optionally, handle other transaction statuses (e.g., 'deny', 'cancel', etc.)

        res.status(200).json({ message: 'Webhook processed' });
    } catch (err) {
        console.error(err);
        next(err);
    }
}

}

export default PackageController;
