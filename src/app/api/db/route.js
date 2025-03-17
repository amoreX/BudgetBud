import mongoose from "mongoose";
import { connectDB } from "./connection";

export const GET = () => {
	connectDB();
	return Response.json({ message: "Connected to MongoDB" });
};
