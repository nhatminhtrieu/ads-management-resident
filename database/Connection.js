import { connect } from 'mongoose';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import Image from '../models/Image.js';
import Advertisement from '../models/Advertisement.js';

config();
export default async () => {
    const CONNECTION_STRING = process.env.CONNECTION_STRING;
    try {
        await connect(CONNECTION_STRING);
        console.log('Database connected');
    } catch (err) {
        console.log('Database connection failed', err);
        process.exit(1);
    }
}

const image1 = new Image({
    url: 'https://images.unsplash.com/photo-1562887248-2f2b6f8c6c77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    caption: 'A beautiful landscape',
    createAt: new Date()
});

image1.save()
    .then((savedImage) => {
        // Create new Advertisement document using the id of the saved Image
        const sampleAdvertisement = new Advertisement({
            id: new mongoose.Types.ObjectId(),
            address: {
                address_components: [{}],
                formatted_text: '123 Main St, Anytown, USA'
            },
            coordinate: {},
            typeLoc: 'PublicLand',
            typeAds: 'PoliticalPromotion',
            typeBoard: 'HiflexPanelPosts',
            number: '123',
            zoning: true,
            size: '10x10',
            imgs: [savedImage._id],
            exp: new Date(),
            status: 'draft'
        });

        sampleAdvertisement.save()
            .then((savedAdvertisement) => {
                console.log('Advertisement saved successfully');
            })
            .catch((error) => {
                console.error('Error saving Advertisement:', error);
            });
    })
    .catch(err => console.error(err));