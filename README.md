# TorGeometrie

Private Torwart-Trainingsapp mit maßstäblicher 2D-Geometrie und 3D-Torwartsicht.

## Android-App

Die Android-App enthält alle Inhalte und benötigt keine Internetverbindung. Die 3D-Ansicht öffnet sich innerhalb der App. „Zurück zur 2D-Ansicht“ oder die Android-Zurück-Taste schließt sie. Stürmer und Torhüter lassen sich mit dem Finger verschieben.

Nach Änderungen an index.html wird unter Actions automatisch eine neue APK erstellt. Nach einem erfolgreichen Lauf „Android-App erstellen“ steht bei Artifacts „TorGeometrie-Android“ zum Download bereit. Das heruntergeladene ZIP enthält TorGeometrie.apk.

Auf Android das ZIP entpacken, die APK öffnen und gegebenenfalls die Installation aus dieser Quelle erlauben. Die App ist für Android 8.0 oder neuer vorgesehen. Jede neue Version wird mit demselben privaten Schlüssel signiert, damit sie als Update installiert werden kann.

## Entwicklung

index.html ist die vollständige App. android-build.cjs erzeugt daraus das native Android-Projekt. Der Workflow .github/workflows/android-apk.yml kompiliert und prüft es. Signierdatei und Passwort werden ausschließlich über GitHub Actions Secrets bereitgestellt und gehören nicht in den Quellcode.

Das Repository bleibt privat. GitHub Pages ist im derzeitigen Tarif deaktiviert.
