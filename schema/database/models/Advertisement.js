import { Schema, model } from 'mongoose';
import Image from './Image';

const AdvertisementSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    coordinate: {
        type: Object,
        required: true
    },
    typeLoc: {
        type: String,
        enum: ['PublicLand', 'Park', 'TrafficSafetyCorridor', 'PrivateLand', 'IndividualHouse', 'CommercialCenter', 'Market', 'GasStation', 'BusStation'],
        required: true
    },
    typeAds: {
        type: String,
        enum: ['PoliticalPromotion', 'CommercialPromotion', 'PublicServiceAnnouncement', 'EventPromotion', 'ProductLaunch'],
        required: true
    },
    typeBoard: {
        type: String,
        enum: ['HiflexPanelPosts', 'LEDElectronicDisplayPosts', 'LightboxPillar', 'WallCladdingHiflexBoard', 'WallCladdingElectronicDisplay', 'VerticalBannerHangingPosts', 'HorizontalBannerHangingPosts', 'PillarsPanelAssemblies', 'GreetingPort', 'ShoppingMalls'],
        required: true
    },
    size: {
        type: String,
        required: true
    },
    imgs: {
        type: [Image],
        required: true
    },
    exp: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'active', 'expired', 'suspended'],
        required: true
    }
});

const Advertisement = model('Advertisement', AdvertisementSchema, 'advertisements');

export default Advertisement;