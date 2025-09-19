# Exemples d'utilisation du MCP PowerPoint

## Exemple 1 : Créer une présentation simple

```
Utilisateur: "Peux-tu créer une nouvelle présentation PowerPoint appelée 'Rapport mensuel' ?"

Mistral utilisera l'outil create_presentation avec :
{
  "name": "create_presentation",
  "arguments": {
    "name": "Rapport mensuel"
  }
}
```

## Exemple 2 : Lister et rechercher des présentations

```
Utilisateur: "Montre-moi toutes mes présentations qui contiennent le mot 'budget'"

Mistral utilisera l'outil list_presentations avec :
{
  "name": "list_presentations", 
  "arguments": {
    "search": "budget",
    "limit": 20
  }
}
```

## Exemple 3 : Obtenir les détails d'une présentation

```
Utilisateur: "Donne-moi plus d'informations sur la présentation avec l'ID 'abc123'"

Mistral utilisera l'outil get_presentation avec :
{
  "name": "get_presentation",
  "arguments": {
    "presentationId": "abc123",
    "includeSlides": true
  }
}
```

## Exemple 4 : Partager une présentation

```
Utilisateur: "Je veux partager ma présentation 'Rapport Q1' avec jean@exemple.com et marie@exemple.com en lecture seule"

Mistral utilisera d'abord list_presentations pour trouver l'ID, puis share_presentation :
{
  "name": "share_presentation",
  "arguments": {
    "presentationId": "xyz789",
    "permissions": "read", 
    "emails": ["jean@exemple.com", "marie@exemple.com"]
  }
}
```

## Exemple 5 : Workflow complet

```
Utilisateur: "Crée une présentation 'Formation équipe', liste mes présentations existantes, puis partage la nouvelle avec l'équipe marketing"

Mistral exécutera :
1. create_presentation pour créer la présentation
2. list_presentations pour afficher toutes les présentations
3. share_presentation pour partager avec l'équipe
```

## Commandes vocales naturelles supportées

- "Crée une présentation..."
- "Montre-moi mes présentations..."
- "Partage cette présentation avec..."
- "Donne-moi les détails de..."
- "Recherche les présentations qui contiennent..."
- "Liste toutes mes présentations..."

## Notes importantes

- Les IDs de présentation sont générés automatiquement par Microsoft Graph
- Les adresses email doivent être valides et appartenir au même tenant Azure AD
- Les permissions peuvent être 'read' (lecture) ou 'edit' (modification)
- La recherche fonctionne sur les noms de fichiers et métadonnées