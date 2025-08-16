import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, TrendingUp, DollarSign, PieChart, Shield, Target, Calculator, BarChart3, Wallet, PiggyBank, CreditCard, Building2, Globe, Zap, AlertTriangle, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: 'investment' | 'planning' | 'risk' | 'general';
}

// 理财工具函数
const financeTools = {
  // 计算投资回报率
  calculateInvestmentReturn: (principal: number, rate: number, years: number, compoundFrequency: 'yearly' | 'monthly' | 'daily' = 'yearly') => {
    const r = rate / 100;
    let n = 1;
    if (compoundFrequency === 'monthly') n = 12;
    if (compoundFrequency === 'daily') n = 365;
    
    const amount = principal * Math.pow(1 + r / n, n * years);
    const totalReturn = amount - principal;
    const roi = (totalReturn / principal) * 100;
    
    return {
      principal,
      finalAmount: Math.round(amount * 100) / 100,
      totalReturn: Math.round(totalReturn * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      years,
      compoundFrequency
    };
  },

  // 计算每月还款金额
  calculateMonthlyPayment: (loanAmount: number, annualRate: number, years: number) => {
    const monthlyRate = annualRate / 100 / 12;
    const numPayments = years * 12;
    
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    const totalPayment = monthlyPayment * numPayments;
    const totalInterest = totalPayment - loanAmount;
    
    return {
      loanAmount,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      years,
      annualRate
    };
  },

  // 风险评估
  riskAssessment: (age: number, income: number, investmentGoal: 'conservative' | 'moderate' | 'aggressive', timeHorizon: number, riskTolerance: 'low' | 'medium' | 'high') => {
    let riskScore = 0;
    
    // 年龄因素
    if (age < 30) riskScore += 3;
    else if (age < 50) riskScore += 2;
    else riskScore += 1;
    
    // 收入因素
    if (income > 1000000) riskScore += 3;
    else if (income > 500000) riskScore += 2;
    else riskScore += 1;
    
    // 投资目标
    if (investmentGoal === 'aggressive') riskScore += 3;
    else if (investmentGoal === 'moderate') riskScore += 2;
    else riskScore += 1;
    
    // 时间跨度
    if (timeHorizon > 10) riskScore += 3;
    else if (timeHorizon > 5) riskScore += 2;
    else riskScore += 1;
    
    // 风险承受能力
    if (riskTolerance === 'high') riskScore += 3;
    else if (riskTolerance === 'medium') riskScore += 2;
    else riskScore += 1;
    
    let riskLevel = 'low';
    let recommendation = '';
    
    if (riskScore >= 12) {
      riskLevel = 'high';
      recommendation = '可以考虑股票、基金等高风险高收益投资';
    } else if (riskScore >= 8) {
      riskLevel = 'medium';
      recommendation = '建议平衡配置股票、债券、基金等';
    } else {
      riskLevel = 'low';
      recommendation = '建议以银行存款、国债等低风险投资为主';
    }
    
    return {
      riskScore,
      riskLevel,
      recommendation,
      factors: {
        age,
        income,
        investmentGoal,
        timeHorizon,
        riskTolerance
      }
    };
  },

  // 应急基金计算
  emergencyFundCalculator: (monthlyExpenses: number, jobStability: 'high' | 'medium' | 'low', familySize: number) => {
    let monthsNeeded = 3;
    
    if (jobStability === 'low') monthsNeeded = 6;
    else if (jobStability === 'medium') monthsNeeded = 4;
    
    if (familySize > 2) monthsNeeded += 1;
    
    const emergencyFund = monthlyExpenses * monthsNeeded;
    
    return {
      monthlyExpenses,
      monthsNeeded,
      emergencyFund: Math.round(emergencyFund),
      recommendation: `建议准备${monthsNeeded}个月的应急基金，约${Math.round(emergencyFund)}元`
    };
  },

  // 退休规划计算
  retirementCalculator: (currentAge: number, retirementAge: number, currentSavings: number, monthlyContribution: number, expectedReturn: number) => {
    const yearsToRetirement = retirementAge - currentAge;
    const monthlyReturn = expectedReturn / 100 / 12;
    const totalMonths = yearsToRetirement * 12;
    
    // 计算复利增长
    let futureValue = currentSavings;
    for (let i = 0; i < totalMonths; i++) {
      futureValue = futureValue * (1 + monthlyReturn) + monthlyContribution;
    }
    
    return {
      currentAge,
      retirementAge,
      yearsToRetirement,
      currentSavings,
      monthlyContribution,
      expectedReturn,
      futureValue: Math.round(futureValue),
      totalContribution: monthlyContribution * totalMonths,
      investmentGrowth: Math.round(futureValue - currentSavings - (monthlyContribution * totalMonths))
    };
  },

  // 资产配置建议
  assetAllocation: (age: number, riskTolerance: 'low' | 'medium' | 'high', investmentGoal: string) => {
    let stocks = 0;
    let bonds = 0;
    let cash = 0;
    let realEstate = 0;
    
    // 基于年龄的配置
    if (age < 30) {
      stocks = 70;
      bonds = 20;
      cash = 10;
    } else if (age < 50) {
      stocks = 60;
      bonds = 30;
      cash = 10;
    } else if (age < 65) {
      stocks = 50;
      bonds = 35;
      cash = 15;
    } else {
      stocks = 30;
      bonds = 50;
      cash = 20;
    }
    
    // 基于风险承受能力的调整
    if (riskTolerance === 'low') {
      stocks -= 20;
      bonds += 15;
      cash += 5;
    } else if (riskTolerance === 'high') {
      stocks += 15;
      bonds -= 10;
      cash -= 5;
    }
    
    return {
      stocks: Math.max(0, Math.min(100, stocks)),
      bonds: Math.max(0, Math.min(100, bonds)),
      cash: Math.max(0, Math.min(100, cash)),
      realEstate: Math.max(0, Math.min(100, realEstate)),
      recommendation: `基于您的年龄(${age}岁)和风险承受能力(${riskTolerance})，建议的资产配置如下`
    };
  }
};

// 处理用户消息的函数
const processFinanceMessage = async (userMessage: string, messageHistory: Message[]) => {
  const lowerMessage = userMessage.toLowerCase();
  
  // 投资回报率计算
  if (lowerMessage.includes('投资') && (lowerMessage.includes('收益') || lowerMessage.includes('回报'))) {
    const numbers = userMessage.match(/\d+/g);
    if (numbers && numbers.length >= 3) {
      const principal = parseFloat(numbers[0]);
      const rate = parseFloat(numbers[1]);
      const years = parseFloat(numbers[2]);
      
      const result = financeTools.calculateInvestmentReturn(principal, rate, years);
      return `📈 **投资回报率计算结果**

**投资详情：**
- 本金：${result.principal.toLocaleString()} 元
- 年化收益率：${rate}%
- 投资年限：${result.years} 年

**计算结果：**
- 最终金额：${result.finalAmount.toLocaleString()} 元
- 总收益：${result.totalReturn.toLocaleString()} 元
- 投资回报率：${result.roi}%

💡 **投资建议：**
- 这是一个${result.roi > 50 ? '非常优秀' : result.roi > 20 ? '不错' : '稳健'}的投资回报
- 建议考虑通货膨胀因素，实际购买力可能有所下降
- 可以考虑分散投资以降低风险`;
    }
  }
  
  // 房贷计算
  if (lowerMessage.includes('房贷') || (lowerMessage.includes('贷款') && lowerMessage.includes('还款'))) {
    const numbers = userMessage.match(/\d+/g);
    if (numbers && numbers.length >= 3) {
      const loanAmount = parseFloat(numbers[0]);
      const annualRate = parseFloat(numbers[1]);
      const years = parseFloat(numbers[2]);
      
      const result = financeTools.calculateMonthlyPayment(loanAmount, annualRate, years);
      return `🏠 **房贷还款计算**

**贷款详情：**
- 贷款金额：${result.loanAmount.toLocaleString()} 元
- 年利率：${result.annualRate}%
- 贷款年限：${result.years} 年

**还款计划：**
- 月还款额：${result.monthlyPayment.toLocaleString()} 元
- 总还款额：${result.totalPayment.toLocaleString()} 元
- 总利息：${result.totalInterest.toLocaleString()} 元

💡 **还款建议：**
- 月还款额占收入比例建议不超过30%
- 可以考虑提前还款以减少利息支出
- 关注利率变化，适时调整还款策略`;
    }
  }
  
  // 退休规划
  if (lowerMessage.includes('退休') || lowerMessage.includes('养老')) {
    const numbers = userMessage.match(/\d+/g);
    if (numbers && numbers.length >= 5) {
      const currentAge = parseFloat(numbers[0]);
      const retirementAge = parseFloat(numbers[1]);
      const currentSavings = parseFloat(numbers[2]);
      const monthlyContribution = parseFloat(numbers[3]);
      const expectedReturn = parseFloat(numbers[4]);
      
      const result = financeTools.retirementCalculator(currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn);
      return `👴 **退休规划计算**

**基本信息：**
- 当前年龄：${result.currentAge} 岁
- 退休年龄：${result.retirementAge} 岁
- 距离退休：${result.yearsToRetirement} 年

**财务状况：**
- 当前储蓄：${result.currentSavings.toLocaleString()} 元
- 月投入：${result.monthlyContribution.toLocaleString()} 元
- 预期年化收益：${result.expectedReturn}%

**退休时资产：**
- 总资产：${result.futureValue.toLocaleString()} 元
- 总投入：${result.totalContribution.toLocaleString()} 元
- 投资收益：${result.investmentGrowth.toLocaleString()} 元

💡 **退休建议：**
- 建议退休后每年提取不超过总资产的4%
- 考虑通货膨胀对购买力的影响
- 可以适当增加月投入以提高退休生活质量`;
    }
  }
  
  // 资产配置
  if (lowerMessage.includes('资产配置') || lowerMessage.includes('投资组合')) {
    const numbers = userMessage.match(/\d+/g);
    if (numbers && numbers.length >= 1) {
      const age = parseFloat(numbers[0]);
      const riskTolerance = lowerMessage.includes('高风险') ? 'high' : lowerMessage.includes('低风险') ? 'low' : 'medium';
      
      const result = financeTools.assetAllocation(age, riskTolerance, 'retirement');
      return `📊 **资产配置建议**

${result.recommendation}：

**建议配置比例：**
- 🏢 股票/基金：${result.stocks}%
- 📜 债券：${result.bonds}%
- 💰 现金/存款：${result.cash}%
- 🏠 房地产：${result.realEstate}%

**配置说明：**
- **股票/基金**：长期增长潜力，适合年轻投资者
- **债券**：稳定收益，降低组合波动性
- **现金/存款**：流动性保障，应对紧急情况
- **房地产**：抗通胀，提供稳定现金流

💡 **投资建议：**
- 定期重新平衡投资组合
- 根据市场情况调整配置比例
- 考虑分散投资到不同行业和地区`;
    }
  }
  
  // 风险评估
  if (lowerMessage.includes('风险') && lowerMessage.includes('评估')) {
    return `🛡️ **投资风险评估**

为了给您提供准确的风险评估，请提供以下信息：

**基本信息：**
- 您的年龄
- 年收入水平
- 投资目标（保守/稳健/激进）
- 投资时间跨度（年）
- 风险承受能力（低/中/高）

**示例：**
"我今年30岁，年收入50万，投资目标稳健，投资时间5年，风险承受能力中等"

请提供您的具体信息，我将为您进行专业的风险评估！`;
  }
  
  // 应急基金计算
  if (lowerMessage.includes('应急基金') || lowerMessage.includes('紧急资金')) {
    return `💰 **应急基金规划**

为了计算您需要的应急基金，请提供：

**基本信息：**
- 月支出金额
- 工作稳定性（高/中/低）
- 家庭成员数量

**示例：**
"我月支出8000元，工作稳定性中等，家庭成员3人"

**应急基金的重要性：**
- 应对突发情况（失业、疾病等）
- 避免因紧急情况而负债
- 提供财务安全感

请提供您的具体信息，我将为您计算合适的应急基金金额！`;
  }
  
  // 默认回复
  return `💰 **智能理财助手**

我可以帮助您进行以下理财分析和计算：

**📊 投资分析**
- 投资回报率计算
- 风险评估和建议
- 投资组合优化

**🏠 贷款计算**
- 房贷还款计算
- 车贷计算
- 其他贷款分析

**👴 退休规划**
- 退休金计算
- 养老金规划
- 长期投资策略

**🛡️ 风险管理**
- 风险承受能力评估
- 应急基金规划
- 保险需求分析

**💡 使用示例：**
- "我想投资10万元，年化收益率8%，5年后能赚多少？"
- "帮我计算房贷100万，利率4.5%，30年每月还款多少？"
- "我今年30岁，计划65岁退休，现在有20万存款，每月投入5000元，预期年化收益6%，退休时有多少钱？"
- "我想评估投资风险等级"
- "我需要准备多少应急基金？"

请告诉我您想了解哪方面的理财信息！`;
};

export default function FinanceAgentWithMastra() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `💰 **欢迎使用智能理财助手！**

我是您的专属理财顾问，可以为您提供：

**📊 投资分析**
- 投资回报率计算
- 风险评估和建议
- 投资组合优化

**🎯 财务规划**
- 个人财务目标设定
- 预算制定和管理
- 应急基金规划

**🧮 财务计算**
- 贷款还款计算
- 复利收益计算
- 退休规划计算

**🛡️ 风险管理**
- 风险承受能力评估
- 保险需求分析
- 资产配置建议

💡 **试试问我这些问题：**
- "我想投资10万元，年化收益率8%，5年后能赚多少？"
- "帮我评估一下我的投资风险等级"
- "计算一下我的房贷每月还款金额"
- "我需要准备多少应急基金？"

🎯 开始您的理财之旅吧！`,
      timestamp: Date.now() - 60000,
      type: 'general'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    
    try {
      // 处理理财消息
      const content = await processFinanceMessage(userMsg.content, messages);
      
      // 判断消息类型
      let type: Message['type'] = 'general';
      const lowerContent = content.toLowerCase();
      if (lowerContent.includes('投资') || lowerContent.includes('收益') || lowerContent.includes('回报')) {
        type = 'investment';
      } else if (lowerContent.includes('规划') || lowerContent.includes('计划') || lowerContent.includes('目标')) {
        type = 'planning';
      } else if (lowerContent.includes('风险') || lowerContent.includes('安全') || lowerContent.includes('保护')) {
        type = 'risk';
      }
      
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content, timestamp: Date.now(), type }
      ]);
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `😅 **处理异常**: ${e.message}`, timestamp: Date.now() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto h-[90vh] flex flex-col bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">智能理财助手 (Mastra版)</h1>
              <p className="text-white/80 text-sm flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                专业的财务规划与投资建议
              </p>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-transparent to-green-50/30">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              } animate-fade-in`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`
              }}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                  : 'bg-gradient-to-r from-green-400 to-blue-500'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <DollarSign className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[70%] ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`relative px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white/90 text-gray-800 border border-gray-200/50'
                  }`}
                >
                  {/* Message tail */}
                  <div
                    className={`absolute top-4 w-3 h-3 rotate-45 ${
                      msg.role === 'user'
                        ? 'right-[-6px] bg-purple-600'
                        : 'left-[-6px] bg-white border-l border-b border-gray-200/50'
                    }`}
                  />
                  
                  <div className="relative z-10">
                    {msg.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    ) : (
                      <div className="text-sm leading-relaxed">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Timestamp */}
                <p className={`text-xs text-gray-500 mt-1 flex items-center gap-1 ${
                  msg.role === 'user' ? 'text-right justify-end' : 'text-left'
                }`}>
                  <Clock className="w-3 h-3" />
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex items-start gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/90 px-6 py-4 rounded-2xl shadow-lg border border-gray-200/50">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm text-gray-500">🧮 正在计算中...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/60 backdrop-blur-sm border-t border-gray-200/30">
          <div className="flex items-end gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-4 text-gray-400 pointer-events-none">
                <MessageSquare className="w-5 h-5" />
              </div>
              <textarea
                ref={inputRef}
                rows={1}
                className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent placeholder-gray-400 shadow-lg text-gray-800"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                }}
                disabled={loading}
                placeholder="💰 输入您的理财问题..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                style={{ maxHeight: '120px' }}
              />
            </div>
            
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeInUp 0.5s ease-out;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.2);
        }

        .markdown-content {
          line-height: 1.6;
        }

        .markdown-content p {
          margin-bottom: 0.75rem;
        }

        .markdown-content p:last-child {
          margin-bottom: 0;
        }

        .markdown-content strong {
          font-weight: 600;
        }

        .markdown-content em {
          font-style: italic;
        }

        .markdown-content code {
          font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
        }

        .markdown-content pre {
          margin: 1rem 0;
        }

        .markdown-content pre code {
          font-size: 0.875rem;
        }

        .markdown-content ul, .markdown-content ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }

        .markdown-content li {
          margin: 0.25rem 0;
        }

        .markdown-content blockquote {
          margin: 1rem 0;
          padding: 0.75rem 1rem;
          border-left: 4px solid #10b981;
          background-color: #ecfdf5;
          border-radius: 0.375rem;
        }

        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          margin: 1rem 0 0.5rem 0;
          font-weight: 600;
          line-height: 1.25;
        }

        .markdown-content h1 {
          font-size: 1.5rem;
        }

        .markdown-content h2 {
          font-size: 1.25rem;
        }

        .markdown-content h3 {
          font-size: 1.125rem;
        }

        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }

        .markdown-content th,
        .markdown-content td {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          text-align: left;
        }

        .markdown-content th {
          background-color: #f3f4f6;
          font-weight: 600;
        }

        .markdown-content a {
          color: #059669;
          text-decoration: underline;
        }

        .markdown-content a:hover {
          color: #047857;
        }
      `}</style>
    </div>
  );
}
