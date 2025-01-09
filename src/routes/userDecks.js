const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const verifyToken = require('../middlewares/verifyToken');

const prisma = new PrismaClient();

router.get('/decks', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId; // 解析token取得userId

    const decks = await prisma.deck_list.findMany({
        where: { user_id: userId },
      });

    res.json({ decks });
  } catch (error) {
    console.error('獲取牌組失敗', error);
    res.status(500).json({ message: '獲取牌組失敗' });
  }
});


router.delete('/decks/:deck_id', verifyToken, async (req, res) => {
  const { deck_id } = req.params;
  const { userId } = req.user

  try {
    const deletedDeck = await prisma.deck_list.delete({
      where: { 
        deck_id,
        user_id: userId,
      },
    });

    res.json( deletedDeck );
  } catch (error) {
    if (error.code === 'P2003') {
      res.status(400).json({ message: '已引用於文章,無法刪除' });
    } else if (error.code === 'P2025') {
      res.status(404).json({ message: '牌組不存在或無權限刪除' });
    } else {
      console.error('删除牌组失败:', error);
      res.status(500).json({ message: '刪除失敗'});
    }
  }
});

module.exports = router;