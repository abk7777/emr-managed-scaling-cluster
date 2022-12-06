# Worklog

## Entries

### 12/5/22
- [x] Check out new branch for CloudFormation deployment
    - [x] cfn template
    - [x] Makefile
    - [x] README.md

## To Do
- [ ] From project files
    ```bash
    └─ emr-managed-scaling-cluster
    ├─ emr
    │  ├─ Makefile
    │  │  ├─ line 9: TODO add .pem file to .gitignore
    │  │  ├─ line 10: TODO add key material to SecretsManager
    │  │  ├─ line 33: TODO add dashboard
    │  │  ├─ line 73: TODO delete dashboard
    │  │  ├─ line 75: TODO delete from SecretsManager
    │  │  └─ line 80: TODO 
    │  └─ template.yaml
    │     ├─ line 92: TODO parameterize MIN_CAPACITY_UNITS
    │     ├─ line 94: TODO parameterize MAX_CAPACITY_UNITS
    │     ├─ line 96: TODO parameterize MAX_ON_DEMAND_CAPACITY_UNITS
    │     └─ line 107: TODO add outputs
    └─ WORKLOG.md
    ```
- [ ] Fix `tee: ___logs/app.log: No such file or directory` in Makefile