# SIMPLY LIFE

TODO : icones app -> messages table cascade + chatrooms cascade

# QUICK TUTO NOTIFICATIONS

ANDOIRD : register android project on firebase -> generate new private key in service accounts (firebase file) -> setup the SHA-1 in general
do eas credentials -> google account -> provide the firebase file
provide local path for google.json in app.config (becareful do not share file with .gitignore, BUT dont ignore file in easignore)

IOS : in ios in certificates & identifier go to identifier and see your project, verify push notifications is active
always in certificate & identifier -> "keys" you should have an apple push notifcations, this file have to be provided in eas expo website -> credentials -> ios -> pushkey
this whole configuration for ios is done automaticly when you create your first build apparently (make sure you have registered 1 iOS device on the apple portal device before running the eas build)

## Development

npx expo prebuild --clean
eas build --profile development --platform android

CASCADE CHAT ROOMS USER AND MESSAGES CHATROOMS

npx create-target

## Web

npx expo export --platform web --output-dir ./build

## Production

eas build --profile production

## Android emulator

adb shell input keyevent 82

// register project on eas expo
eas init

// create configure eas.json
eas build:configure

// link project to the account developer with an identifier
eas credentials

// test e2e locally
maestro test .maestro/expand_test.yml

// creates or update branch production then update the channel production in testflight
eas update --channel production

// native build on eas host (preview for internal testing with testFlight for exemple)
eas build --profile preview

// better for testflight
npx testflight

// trigger workflow
npx eas-cli@latest workflow:run deploy.yaml

// build and submit (default to production i guess)
eas build -s // npx testflight does the same as eas build -p ios -s

// submit (latest) builds you have on eas expo
eas submit --platform ios --latest

// register devices to test internally (use .ipa (Ad Hoc) for exemple on the device registered)
eas device:create
eas device:list

// create consistent alias url hosted
eas deploy --alias dev
eas deploy --prod

eas whoami

// test server,locally (api routes)
npx expo serve

// export web
npx expo export --platform web

// send env var to expo host
eas env:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.example.com"

// realease build and choose device
npx expo run:ios --configuration Release --device

pnpx expo-doctor

// match dependencies of expo sdk
pnpx expo install --fix

// expo atlas (bundle sizes)
EXPO_UNSTABLE_ATLAS=true
http://localhost:8081/\_expo/atlas

<!-- android switch icon -->
<!-- Default Icon -->

    <activity-alias
    	android:name=".MainActivityDefault"
    	android:enabled="true"
    	android:exported="true"
    	android:icon="@mipmap/ic_launcher"
    	android:targetActivity=".MainActivity"
    >
    	<intent-filter>
    		<action android:name="android.intent.action.MAIN"/>
    		<category android:name="android.intent.category.LAUNCHER"/>
    	</intent-filter>
    </activity-alias>

<!-- Secondary Icon -->

    <activity-alias
    	android:name=".MainActivitySecondary"
    	android:enabled="false"
    	android:exported="true"
    	android:icon="@mipmap/ic_launcher_secondary"
    	android:targetActivity=".MainActivity"
    >
    	<intent-filter>
    		<action android:name="android.intent.action.MAIN"/>
    		<category android:name="android.intent.category.LAUNCHER"/>
    	</intent-filter>
    </activity-alias>

    <!-- ios switch icon -->

<key>CFBundleIcons</key>
<dict>
<key>CFBundlePrimaryIcon</key>
<dict>
<key>CFBundleIconFiles</key>
<array>
<string>AppIcon</string>
</array>
<key>UIPrerenderedIcon</key>
<false/>
</dict>
<key>CFBundleAlternateIcons</key>
<dict>
<key>Secondary</key>
<dict>
<key>CFBundleIconFiles</key>
<array>
<string>Secondary</string>
</array>
<key>UIPrerenderedIcon</key>
<false/>
</dict>
</dict>
</dict>
<key>CFBundleIcons~ipad</key>
<dict>
<key>CFBundlePrimaryIcon</key>
<dict>
<key>CFBundleIconFiles</key>
<array>
<string>AppIcon</string>
</array>
<key>UIPrerenderedIcon</key>
<false/>
</dict>
<key>CFBundleAlternateIcons</key>
<dict>
<key>Secondary</key>
<dict>
<key>CFBundleIconFiles</key>
<array>
<string>Secondary</string>
</array>
<key>UIPrerenderedIcon</key>
<false/>
</dict>
</dict>
</dict>

webrtc ? for sharing files for chat

background agent -> doc / tests / continue control code (errors ?) / auto git commit / better auto completion code / suggest better file organization

ONGLET GERARDIN + fix relation user -> commission quand on supprimer user

sport & patrimoine

système de formulaire pour un client avec tout tas d'informations à entrer + document ID à entrer pour des clients lors d'un rdv (cgp), donénes liés à l'utilisatrurt qui a créé le formulaire
nouveau client -> entrer des informations ou retrouver les informations des formulaires

// accepter évènement
// visio ou précense
// intervenants
// theme, société qui intervient et son nom
// 18 entre 10h et 11h
// excel organigramme


//
pré rempli commissions //  evènements groupe valorem par personnes (selectionnés)
//

include denis dans le gros point v2

mail pro / mail perso
cookie session qui s'expire ?

popup evenement recent ?

lire des excels sur un téléphone

Offres du moment / Newsletter / Nouveau fournisseur / Private equity / Nouvel évènement NOTIFS

Jeudi 18 décembre

espace dédié / envoyé fichier perso par user ?

Notifé utilisateur qui n'a pas répondu à évènement 3 jours avant



SHOPIFY / clients excel à customiser
