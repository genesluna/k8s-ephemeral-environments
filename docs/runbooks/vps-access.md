# Runbook: VPS Access

## Overview

This runbook documents how to access the VPS server used for the ephemeral environments platform.

## Server Details

| Atributo | Valor |
|----------|-------|
| **Provedor** | Oracle Cloud Infrastructure (OCI) |
| **IP Público** | `168.138.151.63` |
| **Hostname** | `genilda` |
| **Usuário SSH** | `ubuntu` |
| **Porta SSH** | `22` |
| **OS** | Ubuntu 24.04.3 LTS (Noble Numbat) |
| **Arquitetura** | ARM64 (aarch64) |

## SSH Access

### Standard Connection

```bash
ssh ubuntu@168.138.151.63
```

### With Specific Key

```bash
ssh -i ~/.ssh/your_key ubuntu@168.138.151.63
```

### SSH Config (Recommended)

Add to `~/.ssh/config`:

```
Host k8s-preview
    HostName 168.138.151.63
    User ubuntu
    Port 22
    IdentityFile ~/.ssh/id_ed25519
```

Then connect with:

```bash
ssh k8s-preview
```

## Adding New Team Members

1. Get the team member's public SSH key
2. Connect to the VPS
3. Add the key to authorized_keys:

```bash
echo "ssh-ed25519 AAAA... user@email" >> ~/.ssh/authorized_keys
```

4. Verify permissions:

```bash
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

## Sudo Access

The `ubuntu` user has passwordless sudo access:

```bash
sudo <command>
```

## Common Operations

### Check System Resources

```bash
# CPU and Memory
htop

# Disk usage
df -h

# Memory
free -h
```

### Check Running Services

```bash
# Systemd services
systemctl list-units --type=service --state=running

# k3s status (after installation)
sudo systemctl status k3s
```

### View Logs

```bash
# System logs
sudo journalctl -f

# k3s logs (after installation)
sudo journalctl -u k3s -f
```

## Troubleshooting

### Connection Refused

1. Check if VPS is running in OCI console
2. Verify security list allows port 22
3. Check if SSH service is running:
   ```bash
   sudo systemctl status ssh
   ```

### Permission Denied

1. Verify your public key is in `~/.ssh/authorized_keys`
2. Check file permissions:
   ```bash
   ls -la ~/.ssh/
   ```
3. Check SSH logs:
   ```bash
   sudo tail -f /var/log/auth.log
   ```

### Disk Full

1. Check disk usage:
   ```bash
   df -h
   ```
2. Find large files:
   ```bash
   sudo du -sh /* | sort -rh | head -10
   ```
3. Clean up:
   ```bash
   # Docker images (after k3s install)
   sudo crictl rmi --prune

   # Old logs
   sudo journalctl --vacuum-time=3d
   ```

## Emergency Recovery

### VPS Not Responding

1. Access OCI Console
2. Use Console Connection for serial access
3. Or reboot instance from console

### Lost SSH Access

1. Access OCI Console
2. Use Cloud Shell to connect
3. Or use Console Connection
4. Add SSH key via instance metadata

## Related Runbooks

- [k3s Operations](./k3s-operations.md) (to be created)
- [Cluster Recovery](./cluster-recovery.md) (to be created)
