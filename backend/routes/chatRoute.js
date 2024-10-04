const express=require('express')
const router=express.Router();
const authMiddleware=require('../middlewares/authMiddleware')
const chatController=require('../controllers/chatController')


router.post('/',authMiddleware,chatController.accessChat)
router.get('/',authMiddleware,chatController.fetchChats)
router.post('/group',authMiddleware,chatController.createGroup)
router.post('/rename',authMiddleware,chatController.renameGroup)
router.post('/groupRemove',authMiddleware,chatController.RemoveGroup)
router.post('/addUserToGroup',authMiddleware,chatController.addToGroup)
router.post('/RemoveUserFromGroup',authMiddleware,chatController.removeUserFromGroup)




module.exports=router;
