# Node.js Ansible Deploy

A complete setup for deploying a Node.js application using Ansible automation.

## Project Structure

```
├── app.js                 # Main Node.js application
├── package.json          # NPM dependencies and scripts
├── public/               # Static files
│   └── index.html       # Frontend UI
├── ansible/             # Ansible configuration
│   ├── ansible.cfg      # Ansible configuration
│   ├── inventory.ini    # Server inventory
│   ├── deploy.yml       # Main deployment playbook
│   ├── monitor.yml      # Monitoring playbook
│   └── templates/       # Jinja2 templates
│       ├── nodejs-app.service.j2  # Systemd service template
│       └── nginx-site.conf.j2     # Nginx configuration template
└── README.md            # This file
```

## Features

### Node.js Application
- **Express.js** framework for robust web server
- **Security** with Helmet.js middleware
- **CORS** support for cross-origin requests
- **Health check** endpoint for monitoring
- **Static file serving** for frontend assets
- **Error handling** with proper HTTP status codes

### Ansible Deployment
- **Automated server setup** with Node.js installation
- **Nginx reverse proxy** configuration
- **Systemd service** management
- **Security hardening** with dedicated user
- **Monitoring** and health checks
- **Zero-downtime deployment** capabilities

## Prerequisites

1. **Ansible** installed on control machine:
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install ansible

   # macOS
   brew install ansible

   # pip
   pip install ansible
   ```

2. **SSH access** to target servers
3. **Target servers** running Ubuntu/Debian

## Quick Start

### 1. Install Node.js Dependencies
```bash
npm install
```

### 2. Test Application Locally
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Visit `http://localhost:3000` to see the application.

### 3. Configure Ansible

Edit `ansible/inventory.ini` to add your server details:

```ini
[webservers]
server1 ansible_host=192.168.1.100 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa
server2 ansible_host=192.168.1.101 ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/id_rsa
```

### 4. Deploy Application

```bash
cd ansible
ansible-playbook deploy.yml
```

### 5. Monitor Application

```bash
cd ansible
ansible-playbook monitor.yml
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main application page |
| `/health` | GET | Health check endpoint |
| `/info` | GET | Application information |

## Deployment Process

The Ansible playbook performs the following steps:

1. **System Setup**
   - Updates package cache
   - Installs Node.js and required packages
   - Creates dedicated application user

2. **Application Deployment**
   - Copies application files to server
   - Installs NPM dependencies
   - Creates systemd service

3. **Nginx Configuration**
   - Sets up reverse proxy
   - Configures SSL-ready setup
   - Enables gzip compression

4. **Service Management**
   - Starts and enables services
   - Performs health checks
   - Validates deployment

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node.js environment |
| `PORT` | `3000` | Application port |

### Ansible Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `nodejs_version` | `18` | Node.js version to install |
| `app_name` | `nodejs-ansible-deploy` | Application name |
| `app_port` | `3000` | Application port |
| `app_dir` | `/opt/nodejs-app` | Application directory |
| `app_user` | `nodeapp` | Application user |

## Security Features

- **Helmet.js** for security headers
- **Dedicated user** for application
- **Systemd hardening** with restricted permissions
- **Nginx security headers**
- **Process isolation**

## Monitoring

The application includes:
- Health check endpoint (`/health`)
- Systemd service monitoring
- Nginx access/error logs
- Application logs via journalctl

## Troubleshooting

### Check Application Status
```bash
# On target server
sudo systemctl status nodejs-app
sudo journalctl -u nodejs-app -f

# Via Ansible
ansible-playbook monitor.yml
```

### Check Nginx Status
```bash
# On target server
sudo systemctl status nginx
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/nodejs-ansible-deploy.error.log
```

### Common Issues

1. **Port conflicts**: Ensure port 3000 is not in use
2. **Permissions**: Check file ownership and permissions
3. **Dependencies**: Verify Node.js and npm are properly installed
4. **Firewall**: Ensure ports 80 and 3000 are open if needed

## Development

### Adding New Features
1. Update `app.js` with new routes/functionality
2. Install new dependencies with `npm install`
3. Test locally with `npm run dev`
4. Deploy with `ansible-playbook deploy.yml`

### Updating Dependencies
```bash
npm update
ansible-playbook deploy.yml
```

## License

MIT License - feel free to use this project as a template for your own deployments.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the deployment
5. Submit a pull request

---

🚀 **Happy Deploying!** This setup provides a solid foundation for Node.js application deployment with Ansible automation.
