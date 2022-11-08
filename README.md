Toto DVD je součástí technické zprávy bakalářské práce 

IMPLEMENTACE 3D LOGICKÉ HRY V JAVASCRIPTU

Adresářová struktura:

./audio ............Herní hudba
./css ..............Kaskádové styly
./doc ..............Zdrojové soubory techniké zprávy
./dochtml ..........Vygenerovaná dokumentace hry
./graphics .........Zdrojové soubory grafiky
./img ..............Grafika použitá na webu
./js ...............Implementace hry a pomocné soubory
./levels ...........Herní úrovně
./lightmaps ........Lightmapy
./textures .........Textury
./favicon.ico ......Ikona webu
./ibp.pdf ..........Technická zpráva
./index.html .......HTML dokument hry s GLSL popisem shaderů

Upozornění:

Některé prohlížeče zamezují možnosti načítání souborů z lokálního úložiště. 
U prohlížeče Google Chrome je při jeho spouštění potřeba přidat tyto parametry:

--allow-file-access-from-files --disable-web-security

Hardwarová akcelerace WebGL je možná pouze na grafických čipech podporujících
shader model 2.0. V případě, že Váš hardware tuto technologie nepodporuje,
je ve většině případů možné vykreslovat obraz softwarově. Dále je také nutné
zkontrolovat, zda Váš prohlížeč podporuje WebGL a zda je technologie
v prohlížeči povolena.

Pokud se ocitnete v situaci, kdy je hra podle všeho vykreslována,
avšak obrazovka zůstává černá, pak máte nejspíše zvolenou kameru 
z pohledu berušky a vypnuto zobrazení okolí herní úrovně. Informace
o klávesách, které kameru a zobrazení nastavují, jsou dostupné 
pomocí menu v pravém horním rohu webu. Menu představuje různé
kontexty zobrazení. Zleva jsou to:

* Hra
* Informace o projektu
* Informace o hře
* Ovládání


Martin Knapovský (xknapo02@stud.fit.vutbr.cz, knapovsky@email.cz)
Brno 2012


 