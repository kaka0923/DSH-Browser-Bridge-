import open from 'open';
import clipboard from 'clipboardy';

export const name = 'browser-bridge';
export const inject = ['tools'];

const AI_LIST = [
  { id: 'deepseek', name: 'DeepSeek', url: 'https://chat.deepseek.com' },
  { id: 'zhipu', name: '智谱', url: 'https://chatglm.cn' },
  { id: 'minimax', name: 'Minimax', url: 'https://agent.minimax.cn/' },
  { id: 'kimi', name: 'Kimi', url: 'https://kimi.moonshot.cn' },
  { id: 'doubao', name: '豆包', url: 'https://www.doubao.com' },
  { id: 'yuanbao', name: '元宝', url: 'https://yuanbao.tencent.com' },
  { id: 'qianwen', name: '千问', url: 'https://www.qianwen.com/' },
];

export function apply(ctx) {
  console.log('[AI Hub] 插件加载成功');

  ctx.tools.register({
    name: 'open_all',
    description: '一次性打开所有 AI 页面，问题复制到剪贴板',
    parameters: { prompt: { type: 'string', description: '要问的问题' } },
    output: { schema: { type: 'string' }, render: (result) => [{ type: 'text', text: result }] },
    execute: async (args) => {
      const prompt = args?.prompt || '你好';
      await clipboard.write(prompt);
      for (const ai of AI_LIST) {
        await open(ai.url);
      }
      return `✅ 已打开 ${AI_LIST.length} 个 AI，问题已复制到剪贴板。`;
    }
  });

  for (const ai of AI_LIST) {
    ctx.tools.register({
      name: `open_${ai.id}`,
      description: `单独打开 ${ai.name} 页面，问题复制到剪贴板`,
      parameters: { prompt: { type: 'string', description: '要问的问题' } },
      output: { schema: { type: 'string' }, render: (result) => [{ type: 'text', text: result }] },
      execute: async (args) => {
        const prompt = args?.prompt || '';
        await open(ai.url);
        let msg = `✅ 已打开 ${ai.name}`;
        if (prompt) {
          await clipboard.write(prompt);
          msg += `，问题已复制到剪贴板。`;
        }
        return msg;
      }
    });
  }
}