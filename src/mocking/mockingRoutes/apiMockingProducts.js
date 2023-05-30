import { Router } from "express";
import { generateMockProduct } from "../../utils/mock.js";

const router = Router();

//READ MOCKING PRODUCTS

router.get('/', (req, res, next) => {
    try {
        const { count = 100 } = req.query
        if (isNaN(count) || count <= 0) {
            throw new CustomError({
                title: 'Invalid Parameter',
                code: EnumsError.INVALID_PARAM_ERROR,
                message: 'Count should be a positive number',
            })
        }

        const mockProducts = []
        for (let i = 0; i < count; i++) {
            mockProducts.push(generateMockProduct())
        }
        res.status(200).json({ status: true, payload: mockProducts })
    } catch (error) {
        next(error)
    }
})


export default router;
