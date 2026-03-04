import mongoose from "mongoose";

export const executeQuery = async (intent, params = {}) => {
    const db = mongoose.connection.db;
    const collection = db.collection(intent.collection);

    // Handle count queries
    if (intent.count) {
        return await collection.countDocuments(intent.query);
    }

    // Handle distinct queries
    if (intent.distinct) {
        return await collection.distinct(intent.distinct, intent.query);
    }

    // Handle aggregation
    if (intent.aggregate) {
        const pipeline = JSON.parse(JSON.stringify(intent.aggregate).replace(/{dateThreshold}/g, params.dateThreshold || new Date(Date.now() - 30*24*60*60*1000).toISOString()));
        return await collection.aggregate(pipeline).toArray();
    }

    // Replace parameters in query
    let query = JSON.parse(JSON.stringify(intent.query).replace(/{param}/g, params.param || ""));
    
    // Handle date parameters
    if (params.startDate) query = JSON.parse(JSON.stringify(query).replace(/{startDate}/g, params.startDate));
    if (params.endDate) query = JSON.parse(JSON.stringify(query).replace(/{endDate}/g, params.endDate));

    // Build query options
    const options = {};
    if (intent.projection) options.projection = intent.projection;
    if (intent.sort) options.sort = intent.sort;
    if (intent.limit) options.limit = intent.limit;

    return await collection.find(query, options).toArray();
};
