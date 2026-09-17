const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());

// إعداد التخزين المؤقت للصور المرفوعة
const upload = multer({ storage: multer.memoryStorage() });

// تهيئة عميل جوجل باستخدام المفتاح الخاص بك
const ai = new GoogleGenAI({ apiKey: 'AQ.Ab8RN6IoXD97ClpM6uTZifPZHVLVUpvmw4bXx3YSGZxQATRnIg' });

app.post('/api/analyze', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'لم يتم رفع أي صورة.' });
        }

        // تحويل الصورة إلى النظام الثنائي المناسب للنموذج
        const imagePart = {
            inlineData: {
                data: req.file.buffer.toString("base64"),
                mimeType: req.file.mimetype
            },
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                imagePart,
                'قم بقراءة هذه الصورة ووصف محتواها بدقة شديدة ووصف تفصيلي خالٍ من الأخطاء لكي يتم استخدام الوصف في محرك البحث.'
            ],
        });

        res.json({ description: response.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'حدث خطأ أثناء معالجة الصورة.' });
    }
});

// المنفذ الديناميكي ليتوافق مع السحابة
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
