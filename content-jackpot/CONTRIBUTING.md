# Contributing to Content Jackpot

Thank you for your interest in contributing to Content Jackpot! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm
- PostgreSQL database
- Whop developer account

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/content-jackpot.git
   cd content-jackpot
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start Development**
   ```bash
   pnpm dev
   ```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the ESLint configuration
- **Prettier**: Format code with Prettier
- **Components**: Use functional components with hooks
- **CSS**: Use Tailwind CSS classes

### Commit Guidelines

Follow conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(jackpots): add danger zone percentage validation
fix(api): handle date conversion in submission endpoint
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write clean, documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Your Changes**
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test # when tests are added
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Use descriptive title and description
   - Reference any related issues
   - Include screenshots for UI changes

## 🏗️ Project Structure

### Key Directories

```
app/
├── api/              # API routes
├── components/       # React components
├── create/          # Create jackpot page
├── jackpots/        # Jackpot detail pages
└── analytics/       # Analytics dashboard

lib/
├── validations/     # Zod schemas
├── prisma.ts       # Database client
└── whop-sdk.ts     # Whop SDK config

prisma/
└── schema.prisma   # Database schema
```

### Component Guidelines

- Use TypeScript interfaces for props
- Include JSDoc comments for complex functions
- Follow the existing dark theme design system
- Use semantic HTML elements
- Ensure accessibility (ARIA labels, keyboard navigation)

### API Guidelines

- Use Next.js API routes in `app/api/`
- Validate input with Zod schemas
- Return consistent JSON responses
- Include proper error handling
- Use appropriate HTTP status codes

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test components/JackpotCard.test.tsx
```

### Writing Tests

- Write tests for all new features
- Use Jest and React Testing Library
- Include unit tests for utilities
- Add integration tests for API routes
- Test error scenarios

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for public functions
- Include inline comments for complex logic
- Update README for new features
- Document API endpoints

### Example Documentation

```typescript
/**
 * Creates a new jackpot campaign with validation
 * @param data - The jackpot form data
 * @param userId - ID of the creating user
 * @returns Promise resolving to created jackpot
 * @throws {ValidationError} When data is invalid
 */
async function createJackpot(data: JackpotFormData, userId: string) {
  // Implementation
}
```

## 🐛 Bug Reports

When reporting bugs, include:

1. **Environment**: OS, Node version, browser
2. **Steps to reproduce**: Clear, step-by-step instructions
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Screenshots**: If applicable
6. **Console logs**: Any error messages

Use this template:

```markdown
## Bug Description
Brief description of the bug

## Environment
- OS: macOS 13.0
- Node: 18.17.0
- Browser: Chrome 116.0.0.0

## Steps to Reproduce
1. Go to /create
2. Fill out form
3. Click submit
4. See error

## Expected Behavior
Form should submit successfully

## Actual Behavior
Form shows validation error

## Screenshots
[Attach screenshots]

## Console Logs
```
Error: validation failed
```

## 💡 Feature Requests

For new features:

1. **Check existing issues** to avoid duplicates
2. **Describe the problem** you're trying to solve
3. **Propose a solution** with implementation details
4. **Consider alternatives** and their trade-offs
5. **Provide mockups** for UI changes

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct
- Ask questions when uncertain

## 📞 Getting Help

- **Discord**: Join our Discord server
- **Issues**: Create GitHub issues for bugs/features
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers directly

## 🎉 Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Invited to the contributors team

Thank you for contributing to Content Jackpot! 🏆
