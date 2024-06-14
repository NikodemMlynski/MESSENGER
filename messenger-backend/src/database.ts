import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const dbUrl = `${process.env.DATABASE_URL}`;
        console.log(dbUrl);
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        } as any);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

export default connectDB;
