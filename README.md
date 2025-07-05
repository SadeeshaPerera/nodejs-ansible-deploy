# Advanced Node.js Application with Ansible Deployment

A comprehensive, production-ready Node.js application with enterprise-grade Ansible deployment automation, featuring advanced monitoring, security, and operational capabilities.

## Project Structure

```
├── app.js                      # Main Node.js application with advanced features
├── package.json               # NPM dependencies and scripts
├── ecosystem.config.js        # PM2 process management configuration
├── healthcheck.js             # Docker health check script
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml         # Docker compose for development
├── jest.config.js             # Jest testing configuration
├── jest.setup.js              # Jest setup file
├── .eslintrc.js               # ESLint configuration
├── .prettierrc.js             # Prettier code formatting
├── .env.example               # Environment variables template
├── deploy.sh                  # Automated deployment script
├── public/                    # Static files and frontend assets
│   └── index.html            # Modern responsive UI
├── src/                       # Application source code
│   ├── config/               # Configuration modules
│   │   ├── database.js       # MongoDB connection and configuration
│   │   └── redis.js          # Redis connection and configuration
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js           # JWT authentication and API key validation
│   │   ├── errorHandler.js   # Global error handling and logging
│   │   └── requestLogger.js  # Request tracking and logging
│   ├── routes/               # API route handlers
│   │   ├── api.js            # General API endpoints
│   │   ├── auth.js           # Authentication endpoints
│   │   ├── metrics.js        # Prometheus metrics endpoints
│   │   └── upload.js         # File upload and processing
│   └── utils/                # Utility functions
│       └── logger.js         # Winston logging configuration
├── __tests__/                # Test suite
│   ├── app.test.js           # Application tests
│   └── api.test.js           # API endpoint tests
├── ansible/                  # Ansible deployment automation
│   ├── ansible.cfg           # Ansible configuration
│   ├── inventory.ini         # Multi-environment server inventory
│   ├── deploy.yml            # Main deployment playbook
│   ├── monitor.yml           # Advanced monitoring playbook
│   ├── rolling-update.yml    # Zero-downtime rolling updates
│   ├── disaster-recovery.yml # Backup and recovery procedures
│   └── templates/            # Jinja2 templates
│       ├── .env.j2           # Environment configuration template
│       ├── nodejs-app.service.j2  # Systemd service template
│       ├── nginx-site.conf.j2     # Advanced Nginx configuration
│       ├── nginx.conf.j2           # Nginx global configuration
│       ├── monitor.sh.j2           # Monitoring script template
│       ├── logrotate.j2            # Log rotation configuration
│       ├── mongod.conf.j2          # MongoDB configuration
│       └── redis.conf.j2           # Redis configuration
└── README.md                 # This comprehensive documentation
```

## Advanced Features

### 🚀 Node.js Application Features

#### **Core Application**
- **Express.js** framework with advanced middleware stack
- **TypeScript-ready** codebase with modern ES6+ features
- **Modular architecture** with separation of concerns
- **Comprehensive error handling** with custom error classes
- **Request tracking** with unique request IDs

#### **Security & Authentication**
- **JWT Authentication** with refresh token support
- **API Key validation** for service-to-service communication
- **Role-based access control** (RBAC)
- **Security headers** with Helmet.js
- **Rate limiting** with configurable thresholds
- **Input validation** with express-validator and Joi
- **CORS configuration** with whitelist support
- **Password hashing** with bcrypt

#### **Database & Caching**
- **MongoDB integration** with Mongoose ODM
- **Redis caching** for session management and performance
- **Connection pooling** and automatic reconnection
- **Database migrations** and seeding support
- **Query optimization** and indexing strategies

#### **File Handling & Processing**
- **File upload** with multer and size/type validation
- **Image processing** with Sharp (resize, compress, thumbnails)
- **Secure file storage** with access controls
- **File type detection** and virus scanning ready

#### **Real-time Features**
- **WebSocket support** with Socket.IO
- **Real-time notifications** and live updates
- **Room-based messaging** for multi-user features
- **Connection management** and error handling

#### **Monitoring & Observability**
- **Prometheus metrics** collection and custom metrics
- **Health check endpoints** (health, ready, live, detailed)
- **Performance monitoring** with response time tracking
- **Application metrics** (memory, CPU, uptime)
- **Custom business metrics** tracking
- **Distributed tracing** ready

#### **Logging & Auditing**
- **Structured logging** with Winston
- **Log rotation** and archival
- **Multiple log levels** and destinations
- **Request/response logging** with Morgan
- **Audit trail** for sensitive operations
- **Error tracking** and alerting

#### **Testing & Quality**
- **Unit tests** with Jest and Supertest
- **Integration tests** for API endpoints
- **Code coverage** reporting
- **Linting** with ESLint and Prettier
- **Continuous integration** ready
- **Test automation** with GitHub Actions support

#### **Process Management**
- **PM2 cluster mode** for multi-core utilization
- **Graceful shutdowns** and zero-downtime restarts
- **Process monitoring** and automatic restarts
- **Memory leak detection** and prevention
- **Load balancing** across multiple instances

#### **API Documentation**
- **Swagger/OpenAPI 3.0** documentation
- **Interactive API explorer** with Swagger UI
- **Request/response examples** and schemas
- **Authentication documentation** and testing
- **Version management** and deprecation notices

### 🔧 Ansible Deployment Features

#### **Multi-Environment Support**
- **Production, Staging, Development** environment configurations
- **Environment-specific variables** and settings
- **Secure credential management** with Ansible Vault
- **Infrastructure as Code** principles
- **Configuration drift detection** and remediation

#### **Advanced Deployment Strategies**
- **Blue-Green deployments** for zero downtime
- **Rolling updates** with configurable batch sizes
- **Canary deployments** for risk mitigation
- **Rollback capabilities** with automated triggers
- **Health check validation** at each step

#### **Infrastructure Automation**
- **Server provisioning** and configuration
- **Service discovery** and registration
- **Load balancer management** with health checks
- **SSL/TLS certificate** automation with Let's Encrypt
- **DNS management** and failover configuration

#### **Database & Cache Management**
- **MongoDB cluster** setup and configuration
- **Redis cluster** with sentinel for high availability
- **Database migrations** and schema management
- **Backup automation** with retention policies
- **Point-in-time recovery** capabilities

#### **Security Hardening**
- **System security** with kernel parameter tuning
- **Firewall configuration** with UFW
- **SSH hardening** and key management
- **User access controls** and privilege escalation
- **Security scanning** and vulnerability assessment
- **Intrusion detection** system integration

#### **Performance Optimization**
- **System tuning** for high-performance workloads
- **Resource limits** and cgroup configuration
- **Network optimization** and TCP tuning
- **Memory management** and swap configuration
- **I/O optimization** for database workloads

#### **Monitoring & Alerting**
- **Comprehensive health monitoring** with 20+ metrics
- **Real-time alerting** via Slack, email, webhooks
- **Performance benchmarking** and trend analysis
- **Log aggregation** and centralized monitoring
- **Metrics collection** with Prometheus integration
- **Grafana dashboards** for visualization

#### **Backup & Disaster Recovery**
- **Automated backup schedules** with rotation
- **Cross-region backup replication**
- **Disaster recovery procedures** with RTO/RPO targets
- **Backup validation** and restore testing
- **Point-in-time recovery** capabilities
- **Configuration backup** and versioning

#### **Operational Excellence**
- **Log rotation** and archival management
- **Maintenance windows** and scheduling
- **Capacity planning** and auto-scaling
- **Cost optimization** and resource management
- **Documentation generation** and runbooks

## Prerequisites

### Development Environment
1. **Node.js 18+** and npm
2. **Git** for version control
3. **Docker** (optional, for containerized development)
4. **Code editor** with ESLint and Prettier support

### Deployment Environment
1. **Ansible 4.0+** installed on control machine:
   ```bash
   # Ubuntu/Debian
   sudo apt update && sudo apt install ansible python3-pip
   pip3 install ansible

   # macOS
   brew install ansible

   # Or using pip
   pip install ansible ansible-lint
   ```

2. **Target servers** running Ubuntu 20.04+ or Debian 11+
3. **SSH access** with sudo privileges
4. **Domain name** (optional, for SSL/TLS)

### System Requirements
- **Minimum**: 2 CPU cores, 4GB RAM, 20GB storage
- **Recommended**: 4 CPU cores, 8GB RAM, 50GB storage
- **Production**: 8+ CPU cores, 16GB+ RAM, 100GB+ storage

## Quick Start Guide

### 1. Local Development Setup

```bash
# Clone the repository
git clone <repository-url>
cd nodejs-ansible-deploy

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env

# Start development server
npm run dev

# Or start with PM2
npm run pm2:start
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

### 3. Docker Development (Optional)

```bash
# Build Docker image
npm run docker:build

# Run with Docker
npm run docker:run

# Or use Docker Compose
docker-compose up -d
```

### 4. Production Deployment

#### Configure Inventory
Edit `ansible/inventory.ini` with your server details:

```ini
[production]
web1 ansible_host=192.168.1.10 ansible_user=ubuntu
web2 ansible_host=192.168.1.11 ansible_user=ubuntu
db1 ansible_host=192.168.1.20 ansible_user=ubuntu

[production:vars]
app_environment=production
ssl_enabled=true
app_domain=yourdomain.com
use_pm2=true
install_mongodb=true
install_redis=true
```

#### Deploy Application
```bash
# Check prerequisites
./deploy.sh --check

# Deploy to production
./deploy.sh --deploy

# Monitor deployment
./deploy.sh --monitor

# Or use Ansible directly
cd ansible
ansible-playbook -i inventory.ini deploy.yml --limit production
```

#### Rolling Updates
```bash
# Zero-downtime rolling update
ansible-playbook -i inventory.ini rolling-update.yml
```

#### Disaster Recovery
```bash
# Restore from backup
ansible-playbook -i inventory.ini disaster-recovery.yml \
  -e backup_restore_path=/path/to/backup.tar.gz
```

## API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/` | GET | Application information | No |
| `/health` | GET | Basic health check | No |
| `/health/detailed` | GET | Detailed health status | No |
| `/ready` | GET | Readiness probe | No |
| `/live` | GET | Liveness probe | No |
| `/metrics` | GET | Prometheus metrics | No* |
| `/api-docs` | GET | Swagger documentation | No |
| `/api/v1/status` | GET | API status | No |
| `/api/v1/data` | GET | Sample data | API Key |
| `/api/v1/secure` | GET | Secure endpoint | JWT |
| `/api/v1/echo` | POST | Echo service | No |
| `/api/v1/auth/login` | POST | User authentication | No |
| `/api/v1/auth/register` | POST | User registration | No |
| `/api/v1/upload/image` | POST | Image upload/processing | JWT |
| `/api/v1/upload/files` | GET | List uploaded files | JWT |
| `/api/v1/metrics/custom` | GET | Custom metrics | JWT |

*Metrics endpoint restricted to internal networks

## Environment Configuration

### Core Settings
```bash
# Application
NODE_ENV=production
PORT=3000
APP_NAME=nodejs-ansible-deploy

# Security
JWT_SECRET=your-super-secure-jwt-secret
API_KEY=your-api-key-here
BCRYPT_ROUNDS=12

# Database
MONGODB_URI=mongodb://localhost:27017/nodejs-ansible-deploy
REDIS_URL=redis://localhost:6379

# Features
FEATURE_WEBSOCKET_ENABLED=true
FEATURE_FILE_UPLOAD_ENABLED=true
FEATURE_METRICS_ENABLED=true
```

### Ansible Variables

#### Global Variables
```yaml
# ansible/inventory.ini
nodejs_version: 18
app_port: 3000
app_dir: /opt/nodejs-app
use_pm2: true
ssl_enabled: true
```

#### Environment-Specific
```yaml
# Production
app_environment: production
install_mongodb: true
install_redis: true
backup_before_deploy: true
run_tests: true

# Staging  
app_environment: staging
install_mongodb: false
install_redis: false
ssl_enabled: false
```

## Advanced Deployment Features

### Multi-Environment Management
```bash
# Deploy to specific environment
ansible-playbook -i inventory.ini deploy.yml --limit production
ansible-playbook -i inventory.ini deploy.yml --limit staging

# Environment-specific variables
ansible-playbook -i inventory.ini deploy.yml -e app_environment=production
```

### Blue-Green Deployment
```bash
# Deploy to green environment
ansible-playbook -i inventory.ini deploy.yml --limit green

# Switch traffic
ansible-playbook -i inventory.ini switch-traffic.yml

# Rollback if needed
ansible-playbook -i inventory.ini rollback.yml
```

### Database Management
```bash
# Setup MongoDB cluster
ansible-playbook -i inventory.ini setup-mongodb.yml

# Setup Redis cluster
ansible-playbook -i inventory.ini setup-redis.yml

# Run database migrations
ansible-playbook -i inventory.ini migrate.yml
```

### SSL/TLS Management
```bash
# Setup SSL certificates
ansible-playbook -i inventory.ini ssl-setup.yml

# Renew certificates
ansible-playbook -i inventory.ini ssl-renew.yml
```

## Monitoring & Operations

### Health Monitoring
```bash
# Comprehensive monitoring
./deploy.sh --monitor

# Specific checks
ansible-playbook -i inventory.ini monitor.yml --tags health
ansible-playbook -i inventory.ini monitor.yml --tags performance
ansible-playbook -i inventory.ini monitor.yml --tags security
```

### Log Management
```bash
# View application logs
journalctl -u nodejs-app -f

# View Nginx logs
tail -f /var/log/nginx/nodejs-ansible-deploy.access.log

# Rotate logs manually
logrotate -f /etc/logrotate.d/nodejs-ansible-deploy
```

### Performance Tuning
```bash
# System optimization
ansible-playbook -i inventory.ini optimize.yml

# Database optimization
ansible-playbook -i inventory.ini db-optimize.yml

# Cache optimization
ansible-playbook -i inventory.ini cache-optimize.yml
```

### Backup Operations
```bash
# Create backup
ansible-playbook -i inventory.ini backup.yml

# Restore from backup
ansible-playbook -i inventory.ini restore.yml \
  -e backup_file=/path/to/backup.tar.gz

# List available backups
ansible-playbook -i inventory.ini list-backups.yml
```

## Security Features

### Application Security
- **Input validation** with sanitization
- **SQL injection** prevention
- **XSS protection** with CSP headers
- **Rate limiting** by IP and user
- **Authentication** with JWT tokens
- **Authorization** with role-based access
- **Session management** with secure cookies
- **Audit logging** for sensitive operations

### Infrastructure Security
- **System hardening** with security benchmarks
- **Firewall configuration** with minimal exposure
- **SSH hardening** with key-based authentication
- **SSL/TLS encryption** with modern ciphers
- **Regular security updates** automation
- **Intrusion detection** monitoring
- **Vulnerability scanning** integration

### Data Protection
- **Encryption at rest** for sensitive data
- **Encryption in transit** for all communications
- **Data backup encryption**
- **PII data handling** with GDPR compliance
- **Data retention policies**
- **Secure data deletion**

## Performance Optimization

### Application Performance
- **Connection pooling** for databases
- **Caching strategies** with Redis
- **Compression** with gzip/brotli
- **Static asset optimization**
- **CDN integration** ready
- **Load balancing** with session affinity
- **Response time monitoring**

### System Performance
- **Kernel parameter tuning**
- **Memory management optimization**
- **I/O scheduler optimization**
- **Network stack tuning**
- **CPU scheduling optimization**
- **Storage performance tuning**

### Database Performance
- **Index optimization**
- **Query performance monitoring**
- **Connection pool tuning**
- **Read replicas** for scaling
- **Sharding** for horizontal scaling
- **Caching** at multiple levels

## Troubleshooting Guide

### Common Issues

#### Application Won't Start
```bash
# Check service status
systemctl status nodejs-app

# Check logs
journalctl -u nodejs-app -n 50

# Verify configuration
node -c app.js

# Check dependencies
npm audit
```

#### High Memory Usage
```bash
# Monitor memory
free -h
ps aux --sort=-%mem | head

# Check for memory leaks
node --inspect app.js

# Restart with memory limit
systemctl restart nodejs-app
```

#### Database Connection Issues
```bash
# Check MongoDB
systemctl status mongod
mongo --eval "db.runCommand('ping')"

# Check Redis
systemctl status redis-server
redis-cli ping

# Check network connectivity
telnet localhost 27017
telnet localhost 6379
```

#### SSL Certificate Issues
```bash
# Check certificate status
certbot certificates

# Renew certificates
certbot renew --dry-run

# Test SSL configuration
openssl s_client -connect yourdomain.com:443
```

### Performance Issues
```bash
# Check system resources
top
htop
iotop
nethogs

# Application performance
pm2 monit
pm2 logs

# Database performance
mongostat
redis-cli info stats
```

### Deployment Issues
```bash
# Ansible connectivity
ansible all -i inventory.ini -m ping

# Playbook syntax check
ansible-playbook --syntax-check deploy.yml

# Dry run deployment
ansible-playbook -i inventory.ini deploy.yml --check

# Debug deployment
ansible-playbook -i inventory.ini deploy.yml -vvv
```

## Development Workflow

### Code Quality
1. **Write code** following project conventions
2. **Run tests** to ensure functionality
3. **Lint code** to maintain quality
4. **Format code** with Prettier
5. **Commit changes** with conventional commits
6. **Push to repository** for CI/CD

### Testing Strategy
- **Unit tests** for individual functions
- **Integration tests** for API endpoints
- **End-to-end tests** for user workflows
- **Performance tests** for scalability
- **Security tests** for vulnerabilities
- **Load tests** for reliability

### CI/CD Pipeline
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npm run lint
  
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: ansible-playbook deploy.yml
```

## Architecture & Design

### Application Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Web Servers   │    │   Database      │
│   (Nginx/HAProxy)│───▶│   (Node.js)     │───▶│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │   Cache         │
                       │   (Redis)       │
                       └─────────────────┘
```

### Deployment Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Control Node  │    │   Target Nodes  │    │   Monitoring    │
│   (Ansible)     │───▶│   (App Servers) │───▶│   (Prometheus)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                       ┌─────────────────┐
                       │   Backup        │
                       │   (Storage)     │
                       └─────────────────┘
```

### Scaling Strategy
- **Horizontal scaling** with multiple instances
- **Vertical scaling** with resource optimization
- **Database scaling** with read replicas
- **Cache scaling** with cluster mode
- **Load balancing** with health checks
- **Auto-scaling** based on metrics

## Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Install dependencies
4. Run tests
5. Submit pull request

### Code Standards
- Follow ESLint configuration
- Write comprehensive tests
- Document API changes
- Update README for new features
- Use conventional commit messages

### Release Process
1. Update version in package.json
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to staging
5. Run integration tests
6. Deploy to production
7. Monitor deployment

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support & Community

- **Documentation**: [Project Wiki](wiki-url)
- **Issues**: [GitHub Issues](issues-url)
- **Discussions**: [GitHub Discussions](discussions-url)
- **Chat**: [Discord/Slack](chat-url)
- **Email**: support@yourdomain.com

---

🚀 **Ready for Production!** This setup provides enterprise-grade deployment automation with comprehensive monitoring, security, and operational features suitable for modern production environments.
