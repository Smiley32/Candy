/*

    Développement de Candy Crush Saga en Javascript

    Mohamed Lakhal - Emile Jeannin

    */
    // Types agrégé
    
    // Niveau qui représente le jeu
    var niveau = { x: 0,         // X position       
                   y: 0,         // Y position        
                   tailleX: 10,     // Number of tile columns       
                   tailleY: 10,     // Number of tile rows      
                   tailleCase: 60, // Visual width of a tile       
                   // tailleCaseY: 40,  Visual height of a tile        
                   grille: [],     // The two-dimensional tile array   
                   finDuJeu: 0,    // 0 si le jeu est encore en cours, 1 si le jeu est gagné, 2 si le jeu est perdu
                   nbCoups: 0,     // Nombre de coups
                   score: 0,       // Score du joueur
                   caseADeplacer: { x: -1, y: -1 } };
    
    // Pour afficher correctement la barre de score
    var scorePrec = 0;

    function move(fin) {
        var elem = document.getElementById("bar");
        var width = scorePrec/6000*100;
        var id = setInterval(frame, 25);
        function frame() {
            if (width >= fin) {
                clearInterval(id);
            } 
            else {
                width++;
                if(width >= 100)
                {
                    width = 100;
                    clearInterval(id);
                }
                elem.style.width = width + '%';
                document.getElementById("label").innerHTML = (width|0) + '%';
            }
        }
        scorePrec = niveau.score;
    }   
    
    // Bonbons
    var combo = new Image();
    combo.src = 'images/Combo.png';

    var blue = new Image();
    blue.src = 'images/Blue.png';
    var blueComboHoriz = new Image();
    blueComboHoriz.src = 'images/ComboBlueHoriz.png';
    var blueComboVert = new Image();
    blueComboVert.src = 'images/ComboBlueVert.png';
    
    var green = new Image();
    green.src = 'images/Green.png';
    var greenComboHoriz = new Image();
    greenComboHoriz.src = 'images/ComboGreenHoriz.png';
    var greenComboVert = new Image();
    greenComboVert.src = 'images/ComboGreenVert.png';
    
    var orange = new Image();
    orange.src = 'images/Orange.png';
    var orangeComboHoriz = new Image();
    orangeComboHoriz.src = 'images/ComboOrangeHoriz.png';
    var orangeComboVert = new Image();
    orangeComboVert.src = 'images/ComboOrangeVert.png';
    
    var red = new Image();
    red.src = 'images/Red.png';
    var redComboHoriz = new Image();
    redComboHoriz.src = 'images/ComboRedHoriz.png';
    var redComboVert = new Image();
    redComboVert.src = 'images/ComboRedVert.png';
    
    var yellow = new Image();
    yellow.src = 'images/Yellow.png';
    var yellowComboHoriz = new Image();
    yellowComboHoriz.src = 'images/ComboYellowHoriz.png';
    var yellowComboVert = new Image();
    yellowComboVert.src = 'images/ComboYellowVert.png';

    var vide = new Image();
    vide.src = 'images/Vide.png';
    
    /**
     * Retourne la case qui est cliquee
     * Si aucune case n'est cliquee (souris en dehors de la grille), le retour est {-1, -1}
     */
    caseCliquee = function(pos)
    {
        // on calcule coordonnées de la tuile
        var tx = Math.floor((pos.x - niveau.x) / niveau.tailleCase);
        var ty = Math.floor((pos.y - niveau.y) / niveau.tailleCase);

        // on vérifie si la tuile est valide
         if (tx >= 0 && tx < niveau.tailleX && ty >= 0  && ty < niveau.tailleY) // La tuile est valide
            return { x: tx, y: ty };        
        else //tuile non valide
            return{ x: -1, y: -1 };
    }

    /**
     * Retourne si les cases sont cotes a cotes
     */
    sontAdjacentes = function(case1, case2)
    {
        //on vérifie si la tuile est sur une case adjacente (à côté) de la tuile selectionnée
        if ((Math.abs(case1.x - case2.x) == 1 && case1.y == case2.y) ||  (Math.abs(case1.y - case2.y) == 1 && case1.x == case2.x))
            return true;
        else
            return false;
    }

    var echangeEnCours = false;
    var idDepl;

    /**
     * Echange les valeurs de deux cases
     */
    echanger = function(case1, case2)
    {
        var enX = false;
        var enY = false;

        var pos1, pos2;

        if(!echangeEnCours)
        {
            // Déplacement en X ou en Y : On ne peut pas déplacer de cases en diagonale...
            if(niveau.grille[case1.x][case1.y].x != niveau.grille[case2.x][case2.y].x)
            {
                pos1 = niveau.grille[case1.x][case1.y].x;
                pos2 = niveau.grille[case2.x][case2.y].x;
                enX = true;
            }
            else
            {
                pos1 = niveau.grille[case1.x][case1.y].y;
                pos2 = niveau.grille[case2.x][case2.y].y;
                enY = true;
            }
    
            var temp = niveau.grille[case1.x][case1.y];
            niveau.grille[case1.x][case1.y] = niveau.grille[case2.x][case2.y];
            niveau.grille[case2.x][case2.y] = temp;

            clearInterval(idDepl);
            echangeEnCours = true;
            idDepl = setInterval(depl, 25, case1, case2, enX, enY, pos1, pos2);
            // console.log("ECHANGE" + echangeEnCours);
            
        }
    }

    depl = function(case1, case2, enX, enY, pos1, pos2)
    {
        // console.log("Case 1 : " + niveau.grille[case1.x][case1.y].y);
        // console.log("Case 2 : " + niveau.grille[case2.x][case2.y].y);

        if(enX && niveau.grille[case1.x][case1.y].x > pos1)
        {
            niveau.grille[case1.x][case1.y].x -= 5;
            niveau.grille[case2.x][case2.y].x += 5;
        }
        else if(enX && niveau.grille[case1.x][case1.y].x < pos1)
        {
            niveau.grille[case1.x][case1.y].x += 5;
            niveau.grille[case2.x][case2.y].x -= 5;
        }
        else if(enY && niveau.grille[case1.x][case1.y].y > pos1)
        {
            niveau.grille[case1.x][case1.y].y -= 5;
            niveau.grille[case2.x][case2.y].y += 5;
        }
        else if(enY && niveau.grille[case1.x][case1.y].y < pos1)
        {
            niveau.grille[case1.x][case1.y].y += 5;
            niveau.grille[case2.x][case2.y].y -= 5;
        }
        else
        {
            // console.log("FINI");
            echangeEnCours = false;
            clearInterval(idDepl);
        }
    }

    /*function move(fin) {
        var elem = document.getElementById("bar");
        var width = scorePrec/6000*100;
        var id = setInterval(frame, 25);
        function frame() {
            if (width >= fin) {
                clearInterval(id);
            } 
            else {
                width++;
                if(width >= 100)
                {
                    width = 100;
                    clearInterval(id);
                }
                elem.style.width = width + '%';
                document.getElementById("label").innerHTML = (width|0) + '%';
            }
        }
        scorePrec = niveau.score;
    } */


/*
    //FPS

    var derniereFrame =0;

    var tempsFps = 0;

    var compteurFrame = 0;

    var fps = 0;


    //score

    var score = 0;


    //fin du jeu

    var finDuJeu = false;


    // boutons

    var boutons = { x: 30, y: 240, width: 150, height: 50, text: "Nouveau Jeu" };

    dessinerBoutons = function() {
        for (var i = 0; i < boutons.length; i++) {
        // forme boutons
        context.fillStyle = "#000000";

        context.fillRect(boutons[i].x, boutons[i].y, boutons[i].width, boutons[i].height);

        // Texte du bouton
        context.fillStyle = "#ffffff";
        context.font = "18 px Verdana";
        var textdim = context.measureText(boutons[i].text);

        context.fillText(boutons[i].text, boutons[i].x + (boutons[i].width-textdim.width)/2, boutons[i].y+30);
        }
    }



    update = function(tframe) {

    var dt = (tframe - derniereFrame) / 1000;

    derniereFrame = tframe;


    updateFps(dt);


    updateFps = function(dt) {

    if (tempsFps > 0.25) {

    fps = Math.round(compteurFrame / tempsFps);


    //reset

    tempsFps = 0;

    compteurFrame = 0;

    }


    //augmente le temps et le framecount

    tempsFps += dt;

    compteurFrame++;

    }

    }


    A METTRE DANS RENDER JE PENSE

    //text centré

    drawCenterText = function(text, x, y, width) {

    var textdim = context.measureText(text);

    context.fillText(text, x + (width-textdim.width)/2, y);

    }


    //draw score

    context.fillStyle = "#000000"; //noir

    context.font = "24px Verdana";

    drawCenterText("Score: "; 30, level.y+40, 150);

    drawCenterText(score, 30, level.y+70, 150);

     

    //draw level background

    var levelwidth = level.columns * level.tilewidth;

    var levelheight = level.rows * level.tileheight;

    context.fillStyle = "#000000";

    context.fillRect(level.x - 4, level.y - 4, levelwidth + 8, levelheight + 8);


    //gameover

    if (gameover) {

    context.fillStyle = "rgba(0, 0, 0, 0.8)";

    context.fillRect(level.x, level.y, levelwidth, levelheight);


    context.fillStyle = "#ffffff";

    context.font = "24px Verdana";

    drawCenterText("Game Over!", level.x, level.y + levelheight /2 +10, levelwidth);

    }


    //draw une frame avec bordure

    drawFrame = function() {

    context.fillStyle = "#d0d0d0"; //gris

    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#e8eaec";

    context.fillRect(1, 1, canvas.width-2, canvas.height-2);


    //draw header

    context.fillStyle = "#303030";

    context.fillRect(0, 0, canvas.width, 65);


    //Title

    context.fillStyle = "#ffffff";

    context.font = "24px Verdana";

    context.fillText("Candy Crush - Mohamed & Emile", 10, 30);


    //FPS

    context.fillStyle = "#ffffff";

    context.font = "12px Verdana";

    context.fillText("FPS: " + fps, 13, 50);


    }
    


*/
    
    var rectangle = { x: 0, y: 0, hauteur: 0, largeur: 0, couleur: "" };

    var obstacle = [];
                
    // clic sur la zone de jeu (coordonnées relatives au canvas)
    var clic = { x: -1, y: -1 };

    var touche = { gauche : false, droite: false, haut: false, bas: false };

    // var grille = new Array();
    // var tailleX = 10;
    // var tailleY = 20;
    
    var grilleDeDestruction = new Array();

    var tailleCase = 25;

    /**
     * Retourne si la case est valide ou non
     */
    estValide = function( cs )
    {
        if( cs.x >= 0 && cs.x < niveau.tailleX && cs.y >= 0 && cs.y < niveau.tailleY && niveau.grille[cs.x][cs.y].couleur != 0 && niveau.grille[cs.x][cs.y].couleur != -1)
            return true;
        else
            return false;
    }
    
    /**
     * Creation de la grille de destruction
     */
    creerGrilleDeDestruction = function()
    {
        for(i = 0; i < niveau.tailleX; i++)
        {
            grilleDeDestruction[i] = new Array();
        }
    }
    
    /**
     * Remplit la grille de destruction par des valeurs fausses
     */
    remplirGrilleDeDestruction = function()
    {
        for(j = 0; j < niveau.tailleY; j++)
        {
            for(i = 0; i < niveau.tailleX; i++)
            {
                grilleDeDestruction[i][j] = false;
            }
        }
    }

    /**
     * Creer la grille principale
     */
    creerGrille = function()
    {
        for(i = 0; i < niveau.tailleX; i++)
        {
            niveau.grille[i] = new Array();
        }
    }

    /**
     *  Remplissage de la grille
     */
    remplirGrille = function()
    {
        for(j = 0; j < niveau.tailleY; j++)
        {
            for(i = 0; i < niveau.tailleX; i++)
            {
                niveau.grille[i][j] = { x: 0, y: 0, couleur: 0 };

                niveau.grille[i][j].x = i * niveau.tailleCase;
                niveau.grille[i][j].y = j * niveau.tailleCase;

                niveau.grille[i][j].couleur = rand(0, 5)|0; // Le |0 c'est pour que ce soit un entier
                if(niveau.grille[i][j].couleur == 0) // Pour avoir moins de cases vides
                    niveau.grille[i][j].couleur = rand(0, 5)|0;
            }
        }
    }
    
    /**
     * Affichage d'un texte centre
     */
    drawCenterText = function(text, x, y, width) {
        var textDim = context.measureText(text);
        context.fillText(text, x + (width - textDim.width) / 2, y);
    }

    /**
     * Affichage de la grille (lignes verticales et horizontales)
     */
    affichageGrille = function()
    {
        // Lignes verticales
        for(i = 0; i <= niveau.tailleX; i++)
        {
            context.fillRect(niveau.tailleCase*(i) + niveau.x, niveau.y, 1, niveau.tailleY * niveau.tailleCase);
        }
        // Lignes horizontales
        for(j = 0; j <= niveau.tailleY; j++)
        {
            context.fillRect(niveau.x, niveau.tailleCase*(j) + niveau.y, niveau.tailleX * niveau.tailleCase, 1);
        }
    }
    
    /**
     * affichage des cases a detruire
     */
    affichageCasesADetruire = function()
    {
        for(j = 0; j < niveau.tailleY; j++)
        {
            for(i = 0; i < niveau.tailleX; i++)
            {
                if(grilleDeDestruction[i][j] == true)
                {
                    context.fillStyle="rgba(255, 0, 0, 0.3)";
                    context.fillRect(niveau.tailleCase*i + niveau.x, niveau.tailleCase*j + niveau.y, niveau.tailleCase, niveau.tailleCase);
                }
            }
        }
    }

    /**
     * Affichage des bonbons
     */
    affichageBonbons = function()
    {
        for(j = 0; j < niveau.tailleY; j++)
        {
            for(i = 0; i < niveau.tailleX; i++)
            {
                couleurBonbon(niveau.grille[i][j]);
                // context.fillRect(niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
            }
        }
    }

    /**
     * Affichage de la case selectionnee
     */
    affichageCaseSelec = function(caseSelec)
    {
        context.fillStyle="rgba(0, 0, 0, 0.3)";
        context.fillRect(niveau.tailleCase*caseSelec.x + niveau.x, niveau.tailleCase*caseSelec.y + niveau.y, niveau.tailleCase, niveau.tailleCase);
    }
    
    /**
     * Tracage des bonbons (les images)
     */
    couleurBonbon = function(caseEnCours)
    {
        switch(caseEnCours.couleur)
        {
            case 0:
                context.fillStyle="black";
                context.drawImage(vide, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 1:
                context.fillStyle="red";
                context.drawImage(red, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 6:
                context.drawImage(redComboHoriz, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 11:
                context.drawImage(redComboVert, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 2:
                context.fillStyle="blue";
                context.drawImage(blue, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 7:
                context.drawImage(blueComboHoriz, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 12:
                context.drawImage(blueComboVert, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 3:
                context.fillStyle="green";
                context.drawImage(green, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 8:
                context.drawImage(greenComboHoriz, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 13:
                context.drawImage(greenComboVert, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 4:
                context.fillStyle="orange";
                context.drawImage(orange, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 9:
                context.drawImage(orangeComboHoriz, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 14:
                context.drawImage(orangeComboVert, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 5:
                context.fillStyle="yellow";
                context.drawImage(yellow, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 10:
                context.drawImage(yellowComboHoriz, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 15:
                context.drawImage(yellowComboVert, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 16:
                context.drawImage(combo, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case undefined:
                context.fillStyle="pink";
                break;
            default:
               context.fillStyle="lime";
                break;
        }
    }

    /**
     * Petite fonction aleatoire
     */
    rand = function(mini, maxi) {
        return (Math.random()*(maxi-mini+1))+mini;
    }
    
    /**
     * Detection des bonbons a detruire
     */
    detecter = function()
    {
        var pasDeCasesADetruire = true;
        var couleurTemp;
        var nbCasesAlignees;
        var detruireLigne = false;
        var detruireColonne = false;
        
        for(j = 0; j < niveau.tailleY; j++)
        {
            couleurTemp = niveau.grille[0][j].couleur; // La couleur temporaire est égale à la première case de la grille
            if(couleurTemp != 16)
            {
                if(couleurTemp > 10)
                    couleurTemp -= 10;
                if(couleurTemp > 5)
                    couleurTemp -= 5;
            }
            nbCasesAlignees = 1; // Le nombre de cases alignées est égal à 1 en début de ligne

            /** Parcours des lignes **/
            for(i = 1; i < niveau.tailleX; i++)
            {
                if(couleurTemp == niveau.grille[i][j].couleur || couleurTemp == niveau.grille[i][j].couleur - 5 || couleurTemp == niveau.grille[i][j].couleur - 10) // Si la couleur temporaire est la même dans cette case, on incrémente nbCasesAlignees
                    nbCasesAlignees++;
                else if(nbCasesAlignees >= 3 && couleurTemp != 0) // Si la couleur n'est pas la même mais qu'on a un alignement, on note dans le deuxième tableau
                {
                    noterLignes(i, j, nbCasesAlignees);
                    
                    for(k = 1; k <= nbCasesAlignees; k++)
                    {
                        if(niveau.grille[i - k][j].couleur <= 10 && niveau.grille[i - k][j].couleur > 5)
                            detruireLigne = true;
                            
                        if(niveau.grille[i - k][j].couleur > 10)
                            noterColonnes(i - k, niveau.tailleY, niveau.tailleY);
                    }
                    
                    if(detruireLigne)
                    {
                        noterLignes(niveau.tailleX, j, niveau.tailleX);
                        detruireLigne = false;
                    }
                    
                    if(nbCasesAlignees == 4)
                    {
                        // Création d'une case combo verticale car l'alignement est horizontal
                        if(niveau.grille[i - 2][j].couleur <= 5)
                            niveau.grille[i - 2][j].couleur = niveau.grille[i - 2][j].couleur + 10;
                        else if(niveau.grille[i - 2][j].couleur <= 10)
                            niveau.grille[i - 2][j].couleur = niveau.grille[i - 2][j].couleur + 5;

                        grilleDeDestruction[i - 2][j] = false;
                    }

                    if(nbCasesAlignees == 5)
                    {
                        niveau.grille[i - 3][j].couleur = 16;
                        grilleDeDestruction[i - 3][j] = false;
                    }
                    
                    nbCasesAlignees = 1;
                    couleurTemp = niveau.grille[i][j].couleur;
                    if(couleurTemp > 10)
                        couleurTemp -= 10;
                    if(couleurTemp > 5)
                        couleurTemp -= 5;
                    pasDeCasesADetruire = false;
                    
                }
                else
                {
                    nbCasesAlignees = 1;
                    couleurTemp = niveau.grille[i][j].couleur;
                    if(couleurTemp > 10)
                        couleurTemp -= 10;
                    if(couleurTemp > 5)
                        couleurTemp -= 5;
                }

                if(i == niveau.tailleX - 1 && nbCasesAlignees >= 3 && couleurTemp != 0)
                {
                    i++;
                    noterLignes(i, j, nbCasesAlignees);
                    
                    for(k = 1; k <= nbCasesAlignees; k++)
                    {
                        if(niveau.grille[i - k][j].couleur <= 10 && niveau.grille[i - k][j].couleur > 5)
                            detruireLigne = true;
                            
                        if(niveau.grille[i - k][j].couleur > 10)
                            noterColonnes(i - k, niveau.tailleY, niveau.tailleY);
                    }
                    
                    if(detruireLigne)
                    {
                        noterLignes(niveau.tailleX, j, niveau.tailleX);
                        detruireLigne = false;
                    }
                    
                    if(nbCasesAlignees == 4)
                    {
                        // Création d'une case combo verticale car l'alignement est horizontal
                        if(niveau.grille[i - 2][j].couleur <= 5)
                            niveau.grille[i - 2][j].couleur = niveau.grille[i - 2][j].couleur + 10;
                        else if(niveau.grille[i - 2][j].couleur <= 10)
                            niveau.grille[i - 2][j].couleur = niveau.grille[i - 2][j].couleur + 5;
                        grilleDeDestruction[i - 2][j] = false;
                    }

                    if(nbCasesAlignees == 5)
                    {
                        niveau.grille[i - 3][j].couleur = 16;
                        grilleDeDestruction[i - 3][j] = false;
                    }
                    
                    pasDeCasesADetruire = false;
                }
            }
        }
        
        for(i = 0; i < niveau.tailleX; i++)
        {
            couleurTemp = niveau.grille[i][0].couleur;
            if(couleurTemp > 10)
                couleurTemp -= 10;
            if(couleurTemp > 5)
                couleurTemp -= 5;
            nbCasesAlignees = 1; // Le nombre de cases alignées est égal à 1 en début de ligne

            /** Parcours des colonnes **/
            for(j = 1; j < niveau.tailleY; j++)
            {
                if(couleurTemp == niveau.grille[i][j].couleur || couleurTemp == niveau.grille[i][j].couleur - 5 || couleurTemp == niveau.grille[i][j].couleur - 10) // Si la couleur temporaire est la même dans cette case, on incrémente nbCasesAlignees
                    nbCasesAlignees++;
                else if(nbCasesAlignees >= 3 && couleurTemp != 0) // Si la couleur n'est pas la même mais qu'on a un alignement, on note dans le deuxième tableau
                {
                    noterColonnes(i, j, nbCasesAlignees);
                    
                    for(k = 1; k <= nbCasesAlignees; k++)
                    {
                        if(niveau.grille[i][j - k].couleur > 10)
                            detruireColonne = true;

                        if(niveau.grille[i][j - k].couleur <= 10 && niveau.grille[i][j - k].couleur > 5)
                            noterLignes(niveau.tailleX, j - k, niveau.tailleX);
                    }
                    
                    if(detruireColonne)
                    {
                        noterColonnes(i, niveau.tailleY, niveau.tailleY);
                        detruireColonne = false;
                    }
                    
                    if(nbCasesAlignees == 4)
                    {
                        // Création d'une case combo horizontale car l'alignement est vertical
                        if(niveau.grille[i][j - 2].couleur <= 5)
                            niveau.grille[i][j - 2].couleur = niveau.grille[i][j - 2].couleur + 5;
                        else if(niveau.grille[i][j - 2].couleur > 10)
                            niveau.grille[i][j - 2].couleur = niveau.grille[i][j - 2].couleur - 5;

                        grilleDeDestruction[i][j - 2] = false;
                    }

                    if(nbCasesAlignees == 5)
                    {
                        niveau.grille[i][j - 3].couleur = 16;
                        grilleDeDestruction[i][j - 3] = false;
                    }
                    
                    nbCasesAlignees = 1;
                    couleurTemp = niveau.grille[i][j].couleur;
                    if(couleurTemp > 10)
                        couleurTemp -= 10;
                    if(couleurTemp > 5)
                        couleurTemp -= 5;
                    pasDeCasesADetruire = false;
                }
                else
                {
                    nbCasesAlignees = 1;
                    couleurTemp = niveau.grille[i][j].couleur;
                    if(couleurTemp > 10)
                        couleurTemp -= 10;
                    if(couleurTemp > 5)
                        couleurTemp -= 5;
                }

                if(j == niveau.tailleY - 1 && nbCasesAlignees >= 3 && couleurTemp != 0)
                {
                    j++;
                    noterColonnes(i, j, nbCasesAlignees);
                    
                    for(k = 1; k <= nbCasesAlignees; k++)
                    {
                        if(niveau.grille[i][j - k].couleur <= 10 && niveau.grille[i][j - k].couleur > 5)
                            noterLignes(niveau.tailleX, j - k, niveau.tailleX);
                            
                        if(niveau.grille[i][j - k].couleur > 10)
                            detruireColonne = true;
                    }
                    
                    if(detruireColonne)
                    {
                        noterColonnes(i, niveau.tailleY, niveau.tailleY);
                        detruireColonne = false;
                    }
                    
                    if(nbCasesAlignees == 4)
                    {
                        // Création d'une case combo horizontale car l'alignement est vertical
                        if(niveau.grille[i][j - 2].couleur <= 5)
                            niveau.grille[i][j - 2].couleur = niveau.grille[i][j - 2].couleur + 10;
                        else if(niveau.grille[i][j - 2].couleur > 10)
                            niveau.grille[i][j - 2].couleur = niveau.grille[i][j - 2].couleur - 5;
                        
                        grilleDeDestruction[i][j - 2] = false;
                    }

                    if(nbCasesAlignees == 5)
                    {
                        niveau.grille[i][j - 3].couleur = 16;
                        grilleDeDestruction[i][j - 3] = false;
                    }
                    
                    pasDeCasesADetruire = false;
                }
            }
        }

        return pasDeCasesADetruire; // Vrai si il n'y a plus de cases a detruire
    }
    
    /**
     * Noter un certain nombre de cases pour les detruires
     */
    noterLignes = function(i, j, nbCasesAlignees)
    {
        for(k = i - nbCasesAlignees; k < i; k++) // On parcourt les cases à noter, mais on ne passe pas quand k == i car i n'est pas dans l'alignement
        {
            if(niveau.grille[k][j].couleur != 0) // Si la case n'est pas une case inutilisable
                grilleDeDestruction[k][j] = true;
        }
    }
    
    /**
     * Noter un certain nombre de cases pour les detruires
     */
    noterColonnes = function(i, j, nbCasesAlignees)
    {
        for(k = j - nbCasesAlignees; k < j; k++)
        {
            if(niveau.grille[i][k].couleur != 0)
                grilleDeDestruction[i][k] = true;
        }
    }

    /**
     * Destruction des cases precedement notees
     */
    detruire = function()
    {

        for(j = 0; j < niveau.tailleY; j++)
        {
            for(i = 0; i < niveau.tailleX; i++)
            {
                if(grilleDeDestruction[i][j] == true)
                {
                    if(niveau.grille[i][j].couleur != 0) // On ne détruit pas les cases inutilisables
                    {
                        niveau.grille[i][j].couleur = -1;
                        niveau.score = niveau.score + 60; // On augmente de 60 a chaque case detruite
                    }
                    grilleDeDestruction[i][j] = false; // On en profite pour réinitialiser la grille servant pour la destruction
                }
            }
        }
    }

    var tab = new Array();
    
    /**
     * On remplace les cases detruites par d'autres après les avoir fait remonter (on a descendu les cases du dessous)
     */
    /*remplacer = function()
    {
        var pos1, pos2, temp;
        //var caseRestantes = true;
        //var uneCaseBouge = false;

        /*for(i = 0; i < niveau.tailleX; i++)
        {
            for(j = 0; j < niveau.tailleY; j++)
            {
                tab[i][j].enCours = false;
            }
        }*/

/*
        for(i = 0; i < niveau.tailleY - 1; i++)
        {
            // Chaque colonne
            for(k = 0; k < niveau.tailleX; k++)
            {
                if(niveau.grille[k][i].couleur == -1)
                    console.log("UNE CASE");
                if(niveau.grille[k][i].couleur != -1 && niveau.grille[k][i+1].couleur == -1)
                {
                    pos1 = niveau.grille[k][i].y;
                    pos2 = niveau.grille[k][i+1].y;

                    temp = niveau.grille[k][i];
                    niveau.grille[k][i] = niveau.grille[k][i+1];
                    niveau.grille[k][i+1] = temp;

                    tab[k][i].enCours = true;
                    clearInterval(tab[k][i]);

                    tab[k][i].yDest = pos1;
                    tab[k][i+1].yDest = pos2;
                }
            }
        }

        clearInterval(idTest);
        idTest = setInterval(test, 25);

        /*caseRestantes = false
        for(k = 0; k < niveau.tailleY; k++)
        {
            for(i = 0; i < niveau.tailleX; i++)
            {
                if(niveau.grille[i][k].couleur == -1)
                    caseRestantes = true;
            }
        }*/

        /*for(l = 0; l < niveau.tailleX; l++)
        {
            if(niveau.grille[0][l].couleur == -1)
                niveau.grille[0][l].couleur = rand(1, 5)|0;
        }*/
        
        
        //if(!uneCaseBouge)
        //{
            /*for(k = 0; k < niveau.tailleY; k++)
            {
                for(i = 0; i < niveau.tailleX; i++)
                {
                    if(niveau.grille[i][k].couleur == -1)
                    {
                        niveau.grille[i][k].couleur = rand(1, 5)|0;
                        // niveau.grille[i][k].couleur = 0; // Juste un test
                    }
                }
            }*/
        //}


    //}

    /*var idTest;
    test = function()
    {
        var fini = true;
        for(i = 0; i < niveau.tailleX; i++)
        {
            for(j = 0; j < niveau.tailleY; j++)
            {
                if(tab[i][j].yellowDest != niveau.grille[i][j].y)// || tab[i][j].yDest != niveau.grille[i][j].y)
                    fini = false;
            }
        }
        if(fini)
            clearInterval(idTest);
        else
        {
            for(i = 0; i < niveau.tailleX; i++)
            {
                for(j = 0; j < niveau.tailleY; j++)
                {
                    if(tab[i][j].yDest > niveau.grille[i][j].y)
                    {
                        niveau.grille[i][j].y += 5;
                    }
                    else if(tab[i][j].yDest < niveau.grille[i][j].y)
                    {
                        niveau.grille[i][j].y -= 5;
                    }

                    /*if(tab[i][j].yDest > niveau.grille[i][j].y)
                    {
                        niveau.grille[i][j].y += 5;
                    }
                    else
                    {
                        niveau.grille[i][j].y -= 5;
                    }*/
                /*}
            }
        }/*

        // console.log("CASE : " + niveau.grille[k][i].y);
        /*niveau.grille[k][i].y -= 5;
        niveau.grille[k][i+1].y += 5;

        if(niveau.grille[k][i+1].y == pos2)
        {
            clearInterval(tab[k][i].id);
            tab[k][i].enCours = false;
        }*/
    //}

/*
    echanger = function(case1, case2)
    {
        var enX = false;
        var enY = false;

        var pos1, pos2;

        if(!echangeEnCours)
        {
            // Déplacement en X ou en Y : On ne peut pas déplacer de cases en diagonale...
            if(niveau.grille[case1.x][case1.y].x != niveau.grille[case2.x][case2.y].x)
            {
                pos1 = niveau.grille[case1.x][case1.y].x;
                pos2 = niveau.grille[case2.x][case2.y].x;
                enX = true;
            }
            else
            {
                pos1 = niveau.grille[case1.x][case1.y].y;
                pos2 = niveau.grille[case2.x][case2.y].y;
                enY = true;
            }
    
            var temp = niveau.grille[case1.x][case1.y];
            niveau.grille[case1.x][case1.y] = niveau.grille[case2.x][case2.y];
            niveau.grille[case2.x][case2.y] = temp;

            clearInterval(idDepl);
            echangeEnCours = true;
            idDepl = setInterval(depl, 25, case1, case2, enX, enY, pos1, pos2);
            console.log("ECHANGE" + echangeEnCours);
            
        }
    }

    depl = function(case1, case2, enX, enY, pos1, pos2)
    {
        console.log("Case 1 : " + niveau.grille[case1.x][case1.y].y);
        console.log("Case 2 : " + niveau.grille[case2.x][case2.y].y);

        if(enX && niveau.grille[case1.x][case1.y].x > pos1)
        {
            niveau.grille[case1.x][case1.y].x -= 5;
            niveau.grille[case2.x][case2.y].x += 5;
        }
        else if(enX && niveau.grille[case1.x][case1.y].x < pos1)
        {
            niveau.grille[case1.x][case1.y].x += 5;
            niveau.grille[case2.x][case2.y].x -= 5;
        }
        else if(enY && niveau.grille[case1.x][case1.y].y > pos1)
        {
            niveau.grille[case1.x][case1.y].y -= 5;
            niveau.grille[case2.x][case2.y].y += 5;
        }
        else if(enY && niveau.grille[case1.x][case1.y].y < pos1)
        {
            niveau.grille[case1.x][case1.y].y += 5;
            niveau.grille[case2.x][case2.y].y -= 5;
        }
        else
        {
            console.log("FINI");
            echangeEnCours = false;
            clearInterval(idDepl);
        }
    }*/

    remplacer = function()
    {
        var j;
        var continuer;
        
        for(k = 0; k < niveau.tailleX; k++)
        {
            for(i = niveau.tailleY - 1; i >= 0; i--)
            {
                if(niveau.grille[k][i].couleur == -1)
                {
                    j = i;
                    continuer = true;
                    while(j > 0 && continuer == true)
                    {
                        j--;
                        if(niveau.grille[k][j].couleur != 0 && niveau.grille[k][j].couleur != -1) // Si on trouve une case correcte, on remplace
                        {
                            niveau.grille[k][i].couleur = niveau.grille[k][j].couleur;
                            niveau.grille[k][j].couleur = -1;
                            continuer = false; // On n'a plus besoin de rechercher
                        }
                    }
                }
            }
        }

        for(k = 0; k < niveau.tailleY; k++)
        {
            for(i = 0; i < niveau.tailleX; i++)
            {
                if(niveau.grille[i][k].couleur == -1)
                {
                    niveau.grille[i][k].couleur = rand(1, 5)|0;
                }
            }
        }
    }

        
    // initialisation (appelée au chargement du corps du document <body onload="init">)    
    init = function() {
        context = document.getElementById("cvs").getContext("2d");
        context.width = document.getElementById("cvs").width;
        context.height = document.getElementById("cvs").height;
        
        creerGrille();
        remplirGrille();
        
        creerGrilleDeDestruction();
        remplirGrilleDeDestruction();
                   
        // On (re)initialise niveau pour quand on clique sur le bouton nouvelle partie
        niveau.x = 0;
        niveau.y = 0;
        niveau.tailleX = 10;
        niveau.tailleY = 10;
        niveau.tailleCase = 60;
        niveau.finDuJeu = 0;
        niveau.nbCoups = 0;
        niveau.score = 0;
        niveau.caseADeplacer.x = -1;
        niveau.caseADeplacer.y = -1;

        for(i = 0; i < niveau.tailleX; i++)
        {
            tab[i] = new Array();
        }

        for(j = 0; j < niveau.tailleY; j++)
        {
            for(i = 0; i < niveau.tailleX; i++)
            {
                tab[i][j] = {id: 0, enCours: false, xDest: 0, yDest: 0};
                tab[i][j].yDest = niveau.grille[i][j].y;
            }
        }


        // Pas de combi au départ :
        while(!detecter())
        {
            detruire();
            remplacer();
        }
        
        niveau.score = 0;

        document.addEventListener("keydown", captureAppuiToucheClavier)
        document.addEventListener("keyup", captureRelacheToucheClavier)
        document.addEventListener("click", captureClicSouris)
        
        boucleDeJeu();
    }
    
    /**
     * Mise a jour du jeu puis affichage
     */
    boucleDeJeu = function() {
        update(Date.now());  
        render();
        requestAnimationFrame(boucleDeJeu);
    }
    var inter;
    // Si un coup est en cours
    var enCours = false;

    /**
     * Mise a jour du processus de detection, destruction, remplacement
     */
    miseAJour = function()
    {
        clearInterval(inter);
        enCours = true; // Pour ne pas jouer de coups tant qu'un autre est en cours
        inter = setInterval(function()
        {
            detruire();
            remplacer();
            detecter();
            
            if(detecter() && pasDeCasesDetruites())
            {
                clearInterval(inter);
                niveau.nbCoups++;
                enCours = false;
            }
        }, 1000);
    }

    /**
     * Verifie qu'il n'y a pas de cases detruites
     */
    pasDeCasesDetruites = function()
    {
        var ret = true;
        var i = 0;
        var j = 0;
        while(i < niveau.tailleX && ret)
        {
            j = 0;
            while(j < niveau.tailleY && ret)
            {
                if(grilleDeDestruction[i][j])
                    ret = false;
                j++;
            }
            i++;
        }
        return ret;
    }

    // Pour se souvenir des cases échangées pour le cas où il faut les rééchanger.
    var cs1, cs2;

    /**
     *  Mise à jour de l'état du jeu
     *  @param  d   date courante
     */
    update = function(d) {
        
        if(estValide(caseCliquee(clic)) && niveau.finDuJeu == 0)
        {
            // console.log("En cours ? --> " + enCours);
            if(sontAdjacentes(niveau.caseADeplacer, caseCliquee(clic)) && !enCours && !echangeEnCours)
            {
                // Si les deux cases sont des combos, on détruit toutes les cases valides de la grille
                if(niveau.grille[niveau.caseADeplacer.x][niveau.caseADeplacer.y].couleur == 16 && niveau.grille[niveau.caseADeplacer.x][niveau.caseADeplacer.y].couleur == niveau.grille[caseCliquee(clic).x][caseCliquee(clic).y].couleur)
                {
                    for(j = 0; j < niveau.tailleY; j++)
                    {
                        for(i = 0; i < niveau.tailleX; i++)
                        {
                            grilleDeDestruction[i][j] = true;
                        }
                    }
                    miseAJour();
                    // Pour ne pas qu'il y ait de cases cliquee apres un coup reussi
                    niveau.caseADeplacer.x = -1;
                    niveau.caseADeplacer.y = -1;
                    clic.x = -1;
                    clic.y = -1;
                }
                else if(niveau.grille[niveau.caseADeplacer.x][niveau.caseADeplacer.y].couleur == 16 || niveau.grille[caseCliquee(clic).x][caseCliquee(clic).y].couleur == 16)
                {
                    // Si une des cases est un combo, on detruit toutes les cases de la couleur de l'autre

                    // Couleur a detruire
                    var couleurDet;
                    if(niveau.grille[niveau.caseADeplacer.x][niveau.caseADeplacer.y].couleur != 16)
                    {
                        couleurDet = niveau.grille[niveau.caseADeplacer.x][niveau.caseADeplacer.y].couleur;
                        grilleDeDestruction[caseCliquee(clic).x][caseCliquee(clic).y] = true;
                    }
                    else
                    {
                        couleurDet = niveau.grille[caseCliquee(clic).x][caseCliquee(clic).y].couleur;
                        grilleDeDestruction[caseCliquee(clic).x][caseCliquee(clic).y] = true;
                    }

                    if(couleurDet > 10)
                        couleurDet -= 10;
                    if(couleurDet > 5)
                        couleurDet -= 5;

                    for(j = 0; j < niveau.tailleY; j++)
                    {
                        for(i = 0; i < niveau.tailleX; i++)
                        {
                            if(niveau.grille[i][j].couleur == couleurDet || niveau.grille[i][j].couleur == couleurDet + 5 || niveau.grille[i][j].couleur == couleurDet + 10)
                                grilleDeDestruction[i][j] = true;
                        }
                    }

                    miseAJour();
                    // Pour ne pas qu'il y ait de cases cliquee apres un coup reussi
                    niveau.caseADeplacer.x = -1;
                    niveau.caseADeplacer.y = -1;
                    clic.x = -1;
                    clic.y = -1;
                }

                if(estValide(niveau.caseADeplacer))
                {
                    // console.log("On échange !");
                    cs1 = niveau.caseADeplacer;
                    cs2 = caseCliquee(clic);
                    echanger(niveau.caseADeplacer, caseCliquee(clic));
                }

                if(detecter() && !casser) // Si il n'y a pas de cases a detruire
                {
                    reechanger = true; // On reechange
                }
                else // Si il y a des cases a detruire
                {
                    casser = true;
                }

            }
            else
            {
                niveau.caseADeplacer = caseCliquee(clic);
            }
        }

        if(reechanger && !echangeEnCours)
        {
            // console.log("REECHANGE");
            echanger(cs1, cs2);
            niveau.caseADeplacer = caseCliquee(clic);
            reechanger = false;
        }

        if(casser && !echangeEnCours && !enCours)
        {
            miseAJour();
            // Pour ne pas qu'il y ait de cases cliquee apres un coup reussi
            niveau.caseADeplacer.x = -1;
            niveau.caseADeplacer.y = -1;
            clic.x = -1;
            clic.y = -1;
            casser = false;
        }
        
        document.getElementById("coups").innerHTML = 10 - niveau.nbCoups;
        document.getElementById("score").innerHTML = niveau.score;
        // document.getElementById("bar").style.width = (niveau.score/6000)*100 + "%";
        // document.getElementById("label").innerHTML = (niveau.score/6000)*100 + "%";
        move((niveau.score/6000)*100);

        // Declaration de la victoire ou de la perte apres les 10 coups
        if(niveau.nbCoups >= 10 && niveau.score < 6000)
            niveau.finDuJeu = 2;
        else if(niveau.nbCoups >= 10 && niveau.score >= 6000)
            niveau.finDuJeu = 1;
    }
    
    var reechanger = false;
    var casser = false;
    
    /**
     *  Fonction réalisant le rendu de l'état du jeu
     */
    render = function() {
        // effacement de l'écran
        context.clearRect(0, 0, context.width, context.height);

        context.fillStyle = "black";
        affichageGrille();

        affichageBonbons();
        affichageCasesADetruire();

        if(niveau.caseADeplacer.x != -1 && niveau.caseADeplacer.y != -1)
            affichageCaseSelec(niveau.caseADeplacer);
        
        // Affichage des messages de fin du jeu (victoire ou perte)
        if (niveau.finDuJeu != 0) {
            context.fillStyle = "rgba(0, 0, 0, 0.8)";
            context.fillRect(niveau.x, niveau.y, niveau.tailleCase * niveau.tailleX, niveau.tailleCase * niveau.tailleY);
        
            context.fillStyle = "#ffffff";
            context.font = "24px Verdana";
        
            if(niveau.finDuJeu == 1)
                drawCenterText("Tu as gagné !", niveau.x, niveau.y + (niveau.tailleCase * niveau.tailleY) / 2 + 10, niveau.tailleCase * niveau.tailleX);
            else
                drawCenterText("Tu as perdu...", niveau.x, niveau.y + (niveau.tailleCase * niveau.tailleY) / 2 + 10, niveau.tailleCase * niveau.tailleX);
        
        }
    }
    
    
    /**
     *  Fonction appelée lorsqu'une touche du clavier est appuyée
     *  Associée à l'événement "keyDown"
     */
    captureAppuiToucheClavier = function(event) {
        // pratique pour connaître les keyCode des touches du clavier :
        //  --> http://www.cambiaresearch.com/articles/15/javascript-key-codes

        // On n'utilise pas le clavier
    }
    
    /**
     *  Fonction appelée lorsqu'une touche du clavier est relâchée
     *  Associée à l'événement "keyUp"
     */
    captureRelacheToucheClavier = function(event) {
        // On n'utilise pas le clavier
    }
    
    /**
     *  Fonction appelée lorsque la souris bouge
     *  Associée à l'événement "click"
     */
    captureClicSouris = function(event) {
        // calcul des coordonnées de la souris dans le canvas
        if (event.target.id == "cvs") {
            clic.x = event.pageX - event.target.offsetLeft;
            clic.y = event.pageY - event.target.offsetTop;
        }
    }  
