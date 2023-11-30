import { connect } from 'mongoose';
import { CONNTECTION_STRING } from '../config';

export default async () => {
    try {
        await connect(CONNTECTION_STRING);
        console.log('Database connected');
    } catch (err) {
        console.log('Database connection failed', err);
        process.exit(1);
    }
}