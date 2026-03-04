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

    // Pagination setup
    const page = params.page || 1;
    const limit = params.limit || intent.defaultLimit || 10;
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const total = intent.pagination ? await collection.countDocuments(query) : 0;

    // Build query options
    const options = {};
    if (intent.projection) options.projection = intent.projection;
    if (intent.sort) options.sort = intent.sort;
    if (intent.pagination) {
        options.skip = skip;
        options.limit = limit;
    } else if (intent.limit) {
        options.limit = intent.limit;
    }

    const results = await collection.find(query, options).toArray();

    // Return with pagination metadata
    if (intent.pagination) {
        return {
            data: results,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                from: skip + 1,
                to: Math.min(skip + limit, total)
            }
        };
    }

    return results;
};
