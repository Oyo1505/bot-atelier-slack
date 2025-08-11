# Architecture Hexagonale - Bot Atelier Slack

## 🏗️ Vue d'ensemble

Ce projet a été refactorisé pour suivre les principes de l'**architecture hexagonale** (Clean Architecture), offrant une meilleure séparation des responsabilités, une testabilité accrue et une maintenance simplifiée.

## 📁 Structure du projet

```
src/
├── domain/                    # 🎯 Cœur métier (Business Logic)
│   ├── entities/             # Entités du domaine
│   │   ├── User.ts
│   │   └── Survey.ts
│   ├── ports/                # Interfaces (contrats)
│   │   ├── UserRepository.ts
│   │   ├── SurveyRepository.ts
│   │   └── MessagingPort.ts
│   └── use-cases/            # Cas d'usage métier
│       ├── CreateSurveyUseCase.ts
│       ├── GenerateReportUseCase.ts
│       └── ProcessSurveyResponseUseCase.ts
├── application/              # 🚀 Couche application
│   ├── SlackCommandHandler.ts
│   └── SlackActionHandler.ts
├── infrastructure/           # 🔌 Adaptateurs externes
│   ├── slack/
│   │   ├── SlackUserRepository.ts
│   │   └── SlackMessagingAdapter.ts
│   ├── google-drive/
│   │   └── GoogleDriveSurveyRepository.ts
│   └── di/
│       └── Container.ts
└── app.ts                    # Point d'entrée
```

## 🎯 Couches de l'architecture

### 1. **Domain (Cœur métier)**
- **Entités** : Représentent les concepts métier (`User`, `Survey`)
- **Ports** : Interfaces définissant les contrats avec l'extérieur
- **Use Cases** : Logique métier pure, indépendante des frameworks

### 2. **Application**
- **Handlers** : Orchestrent les use cases et gèrent les interactions externes
- **Coordination** : Entre les use cases et les adaptateurs

### 3. **Infrastructure**
- **Adaptateurs** : Implémentent les ports pour les services externes
- **Injection de dépendances** : Configuration et wiring des composants

## 🔄 Flux de données

```
Slack Event → Handler → Use Case → Repository → External Service
     ↑                                                      ↓
     ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

## ✅ Avantages de cette architecture

### 1. **Séparation des responsabilités**
- Logique métier isolée des détails techniques
- Chaque couche a une responsabilité claire

### 2. **Testabilité**
- Use cases testables sans dépendances externes
- Mocks faciles à implémenter via les ports

### 3. **Maintenabilité**
- Changements d'infrastructure sans impacter le métier
- Code plus lisible et organisé

### 4. **Évolutivité**
- Ajout de nouveaux adaptateurs sans modifier le métier
- Réutilisation des use cases dans d'autres contextes

## 🚀 Utilisation

### Démarrage
```bash
npm run dev
```

### Commandes disponibles
- `/survey` : Créer un nouveau sondage
- `/rapport` : Générer un rapport des résultats

## 🔧 Configuration

### Variables d'environnement
```env
# Slack
BOT_USER_OAUTH_TOKEN=
SLACK_SIGNING_SECRET=
SLACK_APP_TOKEN=

# Google Drive
GOOGLE_DRIVE_FOLDER_ID=
TYPE=
PROJECT_ID=
PRIVATE_KEY_ID=
PRIVATE_KEY=
CLIENT_EMAIL=
CLIENT_ID=
```

## 🧪 Tests (à implémenter)

```typescript
// Exemple de test d'un use case
describe('CreateSurveyUseCase', () => {
  it('should create survey when user is authorized', async () => {
    const mockUserRepo = createMockUserRepository();
    const mockSurveyRepo = createMockSurveyRepository();
    const mockMessagingPort = createMockMessagingPort();
    
    const useCase = new CreateSurveyUseCase(
      mockSurveyRepo,
      mockUserRepo,
      mockMessagingPort
    );
    
    const result = await useCase.execute('authorized-user-id');
    
    expect(result).toBeDefined();
    expect(mockSurveyRepo.createSurvey).toHaveBeenCalled();
  });
});
```

## 📈 Prochaines étapes

1. **Tests unitaires** : Couvrir les use cases et entités
2. **Tests d'intégration** : Tester les adaptateurs
3. **Validation** : Ajouter des validations métier
4. **Logging** : Implémenter un système de logs structuré
5. **Monitoring** : Ajouter des métriques et alertes

## 🔄 Migration depuis l'ancienne architecture

L'ancien code a été progressivement refactorisé :
- ✅ Extraction des entités métier
- ✅ Création des ports (interfaces)
- ✅ Implémentation des use cases
- ✅ Création des adaptateurs
- ✅ Configuration de l'injection de dépendances
- ✅ Mise à jour du point d'entrée

Les anciens fichiers dans `actions/`, `utils/`, etc. peuvent être supprimés une fois la migration terminée.
