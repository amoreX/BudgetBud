import mongoose from "mongoose";

export async function connectDB() {
	try {
		await mongoose.connect(
			"mongodb+srv://nihal:nihalrahman@bud.u9gm6.mongodb.net/?retryWrites=true&w=majority&appName=bud"
		);
		console.log("Connected to MongoDB");
	} catch (err) {
		console.log(err);
	}
}

export default connectDB;
