import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const context = `
IzmirAdvisor provides real estate advisory services in İzmir and Northern Cyprus.
We help with residence permits, health tourism, student housing, and property investment.
We support foreign clients in both English and Turkish.

Contact us:
Phone: +90 543 898 63 12
Email: info@northerncyprushomes.com
Website: www.izmiradvisor.com

IzmirAdvisor, İzmir ve Kuzey Kıbrıs'ta gayrimenkul danışmanlığı sunar.
Oturum izni, sağlık turizmi, öğrenci evleri ve yatırım konularında biz destek veririz.
Yabancı müşterilere Türkçe ve İngilizce yardımcı oluruz.

İletişim için bizimle doğrudan bağlantıya geçebilirsiniz:
Telefon: +90 543 898 63 12
E-posta: info@northerncyprushomes.com
Web sitesi: www.izmiradvisor.com
`;

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "Aşağıdaki bilgileri temel alarak Türkçe veya İngilizce konuşan kullanıcılara doğal, kısa ve yardımsever yanıtlar ver. Kendinizi firma yetkilisi gibi tanıtın. Bilgi: " + context },
        { role: 'user', content: userMessage }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const botResponse = completion.choices[0].message.content;
    res.json({ reply: botResponse });
  } catch (error) {
    console.error('GPT API Error:', error.message);
    res.status(500).json({ error: 'OpenAI cevabı alınamadı. Lütfen tekrar deneyin.' });
  }
});

app.listen(port, () => {
  console.log(`GPT chat server running at http://localhost:${port}`);
});