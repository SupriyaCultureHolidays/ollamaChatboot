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
        let pipelineStr = JSON.stringify(intent.aggregate);
        if (params.dateThreshold) {
            pipelineStr = pipelineStr.replace(/{dateThreshold}/g, params.dateThreshold);
        }
        const pipeline = JSON.parse(pipelineStr);
        
        // Handle count aggregation (for count_never_logged_in)
        if (intent.template && intent.template.includes('{count}')) {
            const results = await collection.aggregate(pipeline).toArray();
            return results[0]?.total || 0;
        }
        
        // Handle pagination for aggregation
        if (intent.pagination) {
            const page = params.page || 1;
            const limit = params.limit || intent.defaultLimit || 10;
            const skip = (page - 1) * limit;
            
            // Get total count
            const countPipeline = [...pipeline, { $count: "total" }];
            const countResult = await collection.aggregate(countPipeline).toArray();
            const total = countResult[0]?.total || 0;
            
            // Add pagination to pipeline
            pipeline.push({ $skip: skip }, { $limit: limit });
            const results = await collection.aggregate(pipeline).toArray();
            
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
        
        return await collection.aggregate(pipeline).toArray();
    }

    // Replace parameters in query
    let queryStr = JSON.stringify(intent.query);
    if (params.param) queryStr = queryStr.replace(/{param}/g, params.param);
    if (params.startDate) queryStr = queryStr.replace(/{startDate}/g, params.startDate);
    if (params.endDate) queryStr = queryStr.replace(/{endDate}/g, params.endDate);
    const query = JSON.parse(queryStr);

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
