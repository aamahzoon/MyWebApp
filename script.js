class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.historyList = document.getElementById('historyList');
        this.currentInput = '';
        this.previousInput = '';
        this.operator = null;
        this.result = null;
        this.shouldResetDisplay = false;
        this.history = [];
        
        this.init();
    }
    
    init() {
        // رویدادهای دکمه‌ها
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => {
                const value = button.dataset.value;
                this.handleInput(value);
            });
        });
        
        // پشتیبانی از صفحه‌کلید
        document.addEventListener('keydown', (e) => {
            const key = e.key;
            if (key >= '0' && key <= '9') {
                this.handleInput(key);
            } else if (key === '.') {
                this.handleInput('.');
            } else if (key === '+' || key === '-' || key === '*' || key === '/') {
                this.handleInput(key);
            } else if (key === 'Enter' || key === '=') {
                this.handleInput('=');
            } else if (key === 'Backspace') {
                this.handleInput('delete');
            } else if (key === 'Escape') {
                this.handleInput('clear');
            } else if (key === '%') {
                this.handleInput('%');
            }
        });
    }
    
    handleInput(value) {
        switch(value) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.deleteLast();
                break;
            case '=':
                this.calculate();
                break;
            case '+':
            case '-':
            case '*':
            case '/':
                this.setOperator(value);
                break;
            case '%':
                this.percentage();
                break;
            default:
                this.appendNumber(value);
        }
        this.updateDisplay();
    }
    
    appendNumber(value) {
        if (this.shouldResetDisplay) {
            this.currentInput = '';
            this.shouldResetDisplay = false;
        }
        
        if (value === '.' && this.currentInput.includes('.')) return;
        if (this.currentInput === '0' && value !== '.') {
            this.currentInput = value;
        } else {
            this.currentInput += value;
        }
    }
    
    setOperator(operator) {
        if (this.operator && !this.shouldResetDisplay) {
            this.calculate();
        }
        
        if (this.currentInput === '') {
            this.currentInput = this.result || '0';
        }
        
        this.previousInput = this.currentInput;
        this.operator = operator;
        this.shouldResetDisplay = true;
    }
    
    calculate() {
        if (!this.operator || this.previousInput === '') return;
        
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        let result = 0;
        switch(this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    this.currentInput = 'خطا: تقسیم بر صفر';
                    this.operator = null;
                    this.previousInput = '';
                    this.shouldResetDisplay = true;
                    this.updateDisplay();
                    return;
                }
                result = prev / current;
                break;
        }
        
        // گرد کردن به ۱۰ رقم اعشار برای جلوگیری از خطای اعشاری
        result = parseFloat(result.toFixed(10));
        
        // اضافه به تاریخچه
        this.addHistory(`${this.previousInput} ${this.getOperatorSymbol(this.operator)} ${this.currentInput} = ${result}`);
        
        this.result = result;
        this.currentInput = String(result);
        this.operator = null;
        this.previousInput = '';
        this.shouldResetDisplay = true;
    }
    
    percentage() {
        if (this.currentInput === '') return;
        const num = parseFloat(this.currentInput);
        if (!isNaN(num)) {
            this.currentInput = String(num / 100);
        }
    }
    
    deleteLast() {
        if (this.shouldResetDisplay) return;
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
    }
    
    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = null;
        this.result = null;
        this.shouldResetDisplay = false;
        this.history = [];
        this.updateHistoryDisplay();
    }
    
    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[operator] || operator;
    }
    
    addHistory(entry) {
        this.history.unshift(entry);
        if (this.history.length > 10) {
            this.history.pop();
        }
        this.updateHistoryDisplay();
    }
    
    updateHistoryDisplay() {
        this.historyList.innerHTML = this.history.map(item => 
            `<div>${item}</div>`
        ).join('');
    }
    
    updateDisplay() {
        this.display.textContent = this.currentInput || '0';
    }
}

// راه‌اندازی ماشین حساب
const calculator = new Calculator();
