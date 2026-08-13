<div align="center">

# 🧥 ReWear

### Full Stack Web Application with End-to-End DevOps Pipeline

[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://vitejs.dev/)
[![Flask](https://img.shields.io/badge/Flask-Python-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Container-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-EKS-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Jenkins](https://img.shields.io/badge/Jenkins-CI%2FCD-D24939?style=for-the-badge&logo=jenkins&logoColor=white)](https://www.jenkins.io/)
[![Terraform](https://img.shields.io/badge/Terraform-IaC-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)](https://www.terraform.io/)
[![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)

**Atharva Deokar (2023300042) · Saur Deshmukh (2023300045)**


</div>

---

## 🌐 About the Project

**ReWear** is a cloud-native, full-stack web platform that allows users to browse, list, and exchange clothing items. Built with modern technologies and deployed on AWS, it demonstrates a complete production-grade DevOps lifecycle, from a developer's local machine to a live, monitored Kubernetes cluster.

**Key Highlights:**
- 🚀 Fully automated CI/CD from code commit to cloud deployment
- 🐳 Containerized frontend & backend with Docker
- ☸️ Orchestrated on AWS EKS (Elastic Kubernetes Service)
- 📊 Real-time monitoring with Prometheus & Grafana
- 🏗️ Infrastructure provisioned entirely via Terraform

---

## 🏗️ Architecture Diagram

> The diagram below illustrates the complete DevOps pipeline, from developer workstation to end-user access.

![ReWear Architecture Diagram](docs/architecture.png)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React (Vite), Tailwind CSS |
| **Backend** | Flask (Python), REST APIs |
| **Database** | MongoDB |
| **Containerization** | Docker, Docker Compose |
| **Orchestration** | Kubernetes (AWS EKS) |
| **CI/CD** | Jenkins |
| **Code Quality** | SonarQube |
| **Infrastructure as Code** | Terraform |
| **Monitoring** | Prometheus, Grafana |
| **Cloud** | AWS (EKS, EC2, Load Balancer) |

---

## 📄 Key Configuration Files

| File | Purpose |
|---|---|
| `Jenkinsfile` | Defines the full CI/CD pipeline stages |
| `docker-compose.yml` | Local multi-container development setup |
| `k8s/*.yaml` | Kubernetes deployment, service & secret manifests |
| `terraform/main.tf` | AWS EKS cluster and VPC provisioning |
| `sonar-project.properties` | SonarQube project configuration |
| `monitoring/prometheus-config.yaml` | Prometheus scrape configuration |

---

## 📸 Screenshots

| View | Screenshot |
|---|---|
| Homepage | ![Homepage](docs/screenshots/home.jpeg) |
| Dashboard | ![Dashboard](docs/screenshots/dashboard.jpeg) |
| Add Item Form | ![Add Item Form](docs/screenshots/list.jpeg) |
| Jenkins Pipeline | ![Jenkins Pipeline](docs/screenshots/jenkins.png) |
| Grafana Dashboard | ![Grafana Dashboard](docs/screenshots/grafana.jpeg) |

---
