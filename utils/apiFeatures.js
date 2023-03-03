/* The APIFeatures class is a constructor function that takes in a query and a query string, and then
returns an object with methods that can be used to filter, sort, limit, and paginate the query. */
class APIFeatures {
    /**
     * The constructor function is a special method for creating and initializing an object created
     * within a class.
     * @param query - This is the query object that we are going to use to filter the results.
     * @param queryString - The query string that we are going to use to filter the results.
     */
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    /**
     * It takes the query string and replaces the gte, gt, lte, and lt with the $ sign.
     * @returns The query object.
     */
    filter() {
        const queryObj = { ...this.queryString };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];

        excludeFields.forEach((el) => delete queryObj[el]);

        // ADVANCED FILTERING
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        this.query.find(JSON.parse(queryString));

        return this;
    }

    /**
     * The sort() function takes the sort query string and splits it into an array, then joins the
     * array into a string, then sorts the query by the sortBy variable.
     * @returns The query object.
     */
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query.sort(sortBy);
        } else {
            this.query.sort('-createdAt _id');
        }

        return this;
    }

    /**
     * If the queryString.fields exists, then split the queryString.fields by commas, join them with
     * spaces, and select them. Otherwise, select all fields except for the __v field.
     * @returns The query object.
     */
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query.select(fields);
        }
        this.query.select('-__v');

        return this;
    }

    /**
     * This function takes the page number and the limit of the page and skips the number of pages and
     * limits the number of results per page.
     * @returns The query object.
     */
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query.skip(skip).limit(limit);

        return this;
    }
}

module.exports = APIFeatures;
