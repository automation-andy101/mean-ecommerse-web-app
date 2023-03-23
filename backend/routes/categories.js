const {Category} = require('../models/category')
const express = require('express');
const router = express.Router();


/**
 * @swagger
 * components:
 *  schemas:
 *      Category:
 *          type: object
 *          required:
 *              - name
 *          properties:
 *              id:
 *                  type: string
 *                  description: The auto-generated id of category
 *              name:
 *                  type: string
 *                  description: The name of the category
 *              icon:
 *                  type: string
 *                  description: The icon name for the category
 *              color:
 *                  type: string
 *                  description: The hex colour number of the category icon
 *          example:
 *              id: 5f15d54cf3a046427a1c26e3
 *              name: Computers
 *              icon: "#E1F0E7"
 *              color: desktop  
 */ 

/**
 * @swagger
 * tags:
 *  name: Categories
 *  description: The category managing API
 */

/**
 * @swagger
 * /api/v1/categories:
 *  get:
 *      summary: Returns a list of categories
 *      tags: [Categories]
 *      description: Use to request all categories
 *      responses:
 *          '200':
 *              description: A list of categories
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Category'
 *          '500':
 *              description: Failed to get categories from server
 */

// Get categories
router.get(`/`, async (req, res) => {
    const categoryList = await Category.find().catch(err => {
        return res.status(500).json({ success: false, error: err })
    });

    if(!categoryList) {
        res.status(500).json({
            success: false
        })
    }
    res.status(200).send(categoryList);
})


// Get a single category
router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id);

    if(!category) {
        res.status(500).json({
            success: false,
            message: 'Category with the given ID was NOT found!'
        })
    }
    res.status(200).send(category);
})


/**
 * @swagger
 * /api/v1/categories:
 *  post:
 *      summary: Create a new Category
 *      tags: [Categories]
 *      description: Use to create a new category
 *      responses:
 *          '200':
 *              description: A successfull response
 *          '500':
 *              description: The category can not be created
 */

// Post - create category
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();

    if(!category)
    return res.status(404).send('The category cannot be created!');

    res.send(category);
})


/**
 * @swagger
 * /api/v1/categories/{id}:
 *  put:
 *      summary: Update a Category
 *      tags: [Categories]
 *      description: Use to update a category
 *      responses:
 *          '200':
 *              description: A successfull response
 *          '500':
 *              description: The category can not be updated!
 */

// Put - Update a category
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color
        },
        {
            new: true
        }
    )

    if(!category)
    return res.status(404).send('The category cannot be updated!');

    res.send(category);
})


/**
 * @swagger
 * /api/v1/categories/{id}:
 *  delete:
*      summary: Delete a Category
 *      tags: [Categories]
 *      description: Use to delete a category by id number
 *      responses:
 *          '200':
 *              description: A successfull response
 *          '400':
 *              description: The category can not be deleted!
 */

// Delete - delete category
router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if(category) {
            return res.status(200).json({
                success: true,
                message: 'the category was deleted!'
            })
        } else {
            return res.status(404).json({
                success: false,
                message: 'category NOT found!'
            })
        }
    }).catch(err => {
        return res.status(500).json({
            success: false,
            error: err
        })
    })
})

module.exports = router;
