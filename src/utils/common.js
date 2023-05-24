class commonsUtils {
    static buildResponse(data) {
       let paramSort = ""
        if (data.sort) {
            paramSort = `&sort=${data.sort}`
        }
        return {
            status: "success",
            payload: data.docs,
            totalPages: data.totalPages,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: !data.hasPrevPage ? null : `http://localhost:8080/products?limit=${data.limit}&page=${data.prevPage}${paramSort}`,
            nextLink: !data.hasNextPage ? null : `http://localhost:8080/products?limit=${data.limit}&page=${data.nextPage}${paramSort}`,
            sort: data.sort,
            cat: data.cat,
            sortLink: `http://localhost:8080/products?limit=${data.limit}&page=${data.page}&sort=${data.sort === 'asc' ? 'desc' : 'asc'}`,
            sortLink2: `http://localhost:8080/products/category/${data.cat}?sort=${data.sort === 'asc' ? 'desc' : 'asc'}`
        }
    }
}
//

export default commonsUtils;