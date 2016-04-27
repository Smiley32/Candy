/*

    Développement de Candy Crush Saga en Javascript

    Mohamed Lakhal - Emile Jeannin

    */
    // Types agrégé
    
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

    // Bonbons
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

    sontAdjacentes = function(case1, case2)
    {
        //on vérifie si la tuile est sur une case adjacente (à côté) de la tuile selectionnée
         if ((Math.abs(case1.x - case2.x) == 1 && case1.y == case2.y) ||  (Math.abs(case1.y - case2.y) == 1 && case1.x == case2.x))
            return true;
        else
            return false;
    }


    echanger = function(case1, case2)
    {
        var temp = niveau.grille[case1.x][case1.y];
        niveau.grille[case1.x][case1.y] = niveau.grille[case2.x][case2.y];
        niveau.grille[case2.x][case2.y] = temp;
    }


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

    estValide = function( cs )
    {
        if( cs.x >= 0 && cs.x < niveau.tailleX && cs.y >= 0 && cs.y < niveau.tailleY && niveau.grille[cs.x][cs.y] != 0 && niveau.grille[cs.x][cs.y] != -1)
            return true;
        else
            return false;
    }
    
    creerGrilleDeDestruction = function()
    {
        for(i = 0; i < niveau.tailleX; i++)
        {
            grilleDeDestruction[i] = new Array();
        }
    }
    
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

    creerGrille = function()
    {
        for(i = 0; i < niveau.tailleX; i++)
        {
            niveau.grille[i] = new Array();
        }
    }

    // A MODIFIER
    /**
     *  Remplissage de la grille
     */
    remplirGrille = function()
    {
        for(j = 0; j < niveau.tailleY; j++)
        {
            for(i = 0; i < niveau.tailleX; i++)
            {
                niveau.grille[i][j] = rand(0, 5)|0; // Le |0 c'est pour que ce soit un entier
                if(niveau.grille[i][j] == 0) // Pour avoir moins de cases vides
                    niveau.grille[i][j] = rand(0, 5)|0;
            }
        }
    }
    
    drawCenterText = function(text, x, y, width) {
        var textDim = context.measureText(text);
        context.fillText(text, x + (width - textDim.width) / 2, y);
    }

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

    affichageCaseSelec = function(caseSelec)
    {
        context.fillStyle="rgba(0, 0, 0, 0.3)";
        context.fillRect(niveau.tailleCase*caseSelec.x + niveau.x, niveau.tailleCase*caseSelec.y + niveau.y, niveau.tailleCase, niveau.tailleCase);
    }
    
    couleurBonbon = function(numCase)
    {
        switch(numCase)
        {
            case 0:
                context.fillStyle="black";
                break;
            case 1:
                context.fillStyle="red";
                context.drawImage(red, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 6:
                context.drawImage(redComboHoriz, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 11:
                context.drawImage(redComboVert, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 2:
                context.fillStyle="blue";
                context.drawImage(blue, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 7:
                context.drawImage(blueComboHoriz, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 12:
                context.drawImage(blueComboVert, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 3:
                context.fillStyle="green";
                context.drawImage(green, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 8:
                context.drawImage(greenComboHoriz, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 13:
                context.drawImage(greenComboVert, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 4:
                context.fillStyle="orange";
                context.drawImage(orange, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 9:
                context.drawImage(orangeComboHoriz, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 14:
                context.drawImage(orangeComboVert, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 5:
                context.fillStyle="yellow";
                context.drawImage(yellow, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 10:
                context.drawImage(yellowComboHoriz, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case 15:
                context.drawImage(yellowComboVert, niveau.x + niveau.tailleCase*(i)+1, niveau.y + niveau.tailleCase*(j)+1, niveau.tailleCase-2, niveau.tailleCase-2);
                break;
            case undefined:
                context.fillStyle="pink";
                break;
            default:
               context.fillStyle="lime";
                break;
        }
    }

    rand = function(mini, maxi) {
        return (Math.random()*(maxi-mini+1))+mini;
    }
    
    // Detection
    detecter = function()
    {
        var pasDeCasesADetruire = true;
        var couleurTemp;
        var nbCasesAlignees;
        var detruireLigne = false;
        var detruireColonne = false;
        
        for(j = 0; j < niveau.tailleY; j++)
        {
            couleurTemp = niveau.grille[0][j]; // La couleur temporaire est égale à la première case de la grille
            if(couleurTemp > 10)
                couleurTemp -= 10;
            if(couleurTemp > 5)
                couleurTemp -= 5;
            nbCasesAlignees = 1; // Le nombre de cases alignées est égal à 1 en début de ligne

            /** Parcours des lignes **/
            for(i = 1; i < niveau.tailleX; i++)
            {
                if(couleurTemp == niveau.grille[i][j] || couleurTemp == niveau.grille[i][j] - 5 || couleurTemp == niveau.grille[i][j] - 10) // Si la couleur temporaire est la même dans cette case, on incrémente nbCasesAlignees
                    nbCasesAlignees++;
                else if(nbCasesAlignees >= 3 && couleurTemp != 0) // Si la couleur n'est pas la même mais qu'on a un alignement, on note dans le deuxième tableau
                {
                    noterLignes(i, j, nbCasesAlignees);
                    
                    for(k = 1; k <= nbCasesAlignees; k++)
                    {
                        if(niveau.grille[i - k][j] <= 10 && niveau.grille[i - k][j] > 5)
                            detruireLigne = true;
                            
                        if(niveau.grille[i - k][j] > 10)
                            noterColonnes(i - k, niveau.tailleY, niveau.tailleY);
                    }
                    
                    if(detruireLigne)
                    {
                        noterLignes(niveau.tailleX, j, niveau.tailleX);
                        detruireLigne = false;
                    }
                    
                    if(nbCasesAlignees >= 4)
                    {
                        // Création d'une case combo verticale car l'alignement est horizontal
                        if(niveau.grille[i - 2][j] <= 5)
                            niveau.grille[i - 2][j] = niveau.grille[i - 2][j] + 10;
                        else if(niveau.grille[i - 2][j] <= 10)
                            niveau.grille[i - 2][j] = niveau.grille[i - 2][j] + 5;

                        grilleDeDestruction[i - 2][j] = false;
                    }
                    
                    nbCasesAlignees = 1;
                    couleurTemp = niveau.grille[i][j];
                    if(couleurTemp > 10)
                        couleurTemp -= 10;
                    if(couleurTemp > 5)
                        couleurTemp -= 5;
                    pasDeCasesADetruire = false;
                    
                }
                else
                {
                    nbCasesAlignees = 1;
                    couleurTemp = niveau.grille[i][j];
                    if(couleurTemp > 10)
                        couleurTemp -= 10;
                    if(couleurTemp > 5)
                        couleurTemp -= 5;
                }

                if(i == niveau.tailleX - 1 && nbCasesAlignees >= 3 && couleurTemp != 0)
                {
                    noterLignes(i+1, j, nbCasesAlignees);
                    
                    for(k = 1; k <= nbCasesAlignees; k++)
                    {
                        if(niveau.grille[i - k][j] <= 10 && niveau.grille[i - k][j] > 5)
                            detruireLigne = true;
                            
                        if(niveau.grille[i - k][j] > 10)
                            noterColonnes(i - k, niveau.tailleY, niveau.tailleY);
                    }
                    
                    if(detruireLigne)
                    {
                        noterLignes(niveau.tailleX, j, niveau.tailleX);
                        detruireLigne = false;
                    }
                    
                    if(nbCasesAlignees >= 4)
                    {
                        // Création d'une case combo verticale car l'alignement est horizontal
                        if(niveau.grille[i - 2][j] <= 5)
                            niveau.grille[i - 2][j] = niveau.grille[i - 2][j] + 10;
                        else if(niveau.grille[i - 2][j] <= 10)
                            niveau.grille[i - 2][j] = niveau.grille[i - 2][j] + 5;
                        grilleDeDestruction[i - 2][j] = false;
                    }
                    
                    pasDeCasesADetruire = false;
                }
            }
        }
        
        for(i = 0; i < niveau.tailleX; i++)
        {
            couleurTemp = niveau.grille[i][0];
            if(couleurTemp > 10)
                couleurTemp -= 10;
            if(couleurTemp > 5)
                couleurTemp -= 5;
            nbCasesAlignees = 1; // Le nombre de cases alignées est égal à 1 en début de ligne

            /** Parcours des colonnes **/
            for(j = 1; j < niveau.tailleY; j++)
            {
                if(couleurTemp == niveau.grille[i][j] || couleurTemp == niveau.grille[i][j] - 5 || couleurTemp == niveau.grille[i][j] - 10) // Si la couleur temporaire est la même dans cette case, on incrémente nbCasesAlignees
                    nbCasesAlignees++;
                else if(nbCasesAlignees >= 3 && couleurTemp != 0) // Si la couleur n'est pas la même mais qu'on a un alignement, on note dans le deuxième tableau
                {
                    noterColonnes(i, j, nbCasesAlignees);
                    
                    for(k = 1; k <= nbCasesAlignees; k++)
                    {
                        if(niveau.grille[i][j - k] <= 10 && niveau.grille[i][j - k] > 5)
                            noterLignes(niveau.tailleX, j - k, niveau.tailleX);
                            
                        if(niveau.grille[i][j - k] > 10)
                            detruireColonne = true;
                    }
                    
                    if(detruireColonne)
                    {
                        noterColonnes(i, niveau.tailleY, niveau.tailleY);
                        detruireColonne = false;
                    }
                    
                    if(nbCasesAlignees >= 4)
                    {
                        // Création d'une case combo horizontale car l'alignement est vertical
                        if(niveau.grille[i][j - 2] <= 5)
                            niveau.grille[i][j - 2] = niveau.grille[i][j - 2] + 10;
                        else if(niveau.grille[i][j - 2] > 10)
                            niveau.grille[i][j - 2] = niveau.grille[i][j - 2] - 5;

                        grilleDeDestruction[i][j - 2] = false;
                    }
                    
                    nbCasesAlignees = 1;
                    couleurTemp = niveau.grille[i][j];
                    if(couleurTemp > 10)
                        couleurTemp -= 10;
                    if(couleurTemp > 5)
                        couleurTemp -= 5;
                    pasDeCasesADetruire = false;
                }
                else
                {
                    nbCasesAlignees = 1;
                    couleurTemp = niveau.grille[i][j];
                    if(couleurTemp > 10)
                        couleurTemp -= 10;
                    if(couleurTemp > 5)
                        couleurTemp -= 5;
                }

                if(j == niveau.tailleY - 1 && nbCasesAlignees >= 3 && couleurTemp != 0)
                {
                    noterColonnes(i, j+1, nbCasesAlignees);
                    
                    for(k = 1; k <= nbCasesAlignees; k++)
                    {
                        if(niveau.grille[i][j - k] <= 10 && niveau.grille[i][j - k] > 5)
                            noterLignes(niveau.tailleX, j - k, niveau.tailleX);
                            
                        if(niveau.grille[i][j - k] > 10)
                            detruireColonne = true;
                    }
                    
                    if(detruireColonne)
                    {
                        noterColonnes(i, niveau.tailleY, niveau.tailleY);
                        detruireColonne = false;
                    }
                    
                    if(nbCasesAlignees >= 4)
                    {
                        // Création d'une case combo horizontale car l'alignement est vertical
                        if(niveau.grille[i][j - 2] <= 5)
                            niveau.grille[i][j - 2] = niveau.grille[i][j - 2] + 10;
                        else if(niveau.grille[i][j - 2] > 10)
                            niveau.grille[i][j - 2] = niveau.grille[i][j - 2] - 5;
                        
                        grilleDeDestruction[i][j - 2] = false;
                    }
                    
                    pasDeCasesADetruire = false;
                }
            }
        }

        return pasDeCasesADetruire; // Vrai si il n'y a plus de cases a detruire
    }
    
    noterLignes = function(i, j, nbCasesAlignees)
    {
        for(k = i - nbCasesAlignees; k < i; k++) // On parcourt les cases à noter, mais on ne passe pas quand k == i car i n'est pas dans l'alignement
        {
            if(niveau.grille[k][j] != 0) // Si la case n'est pas une case inutilisable
                grilleDeDestruction[k][j] = true;
        }
    }
    
    noterColonnes = function(i, j, nbCasesAlignees)
    {
        for(k = j - nbCasesAlignees; k < j; k++)
        {
            if(niveau.grille[k][j] != 0)
                grilleDeDestruction[i][k] = true;
        }
    }

    // Destruction
    detruire = function()
    {
        for(j = 0; j < niveau.tailleY; j++)
        {
            for(i = 0; i < niveau.tailleX; i++)
            {
                if(grilleDeDestruction[i][j] == true)
                {
                    if(niveau.grille[i][j] != 0) // On ne détruit pas les cases inutilisables
                    {
                        niveau.grille[i][j] = -1;
                        niveau.score = niveau.score + 60; // On augmente de 60 a chaque case detruite
                    }
                    grilleDeDestruction[i][j] = false; // On en profite pour réinitialiser la grille servant pour la destruction
                }
            }
        }
    }
    
    // Remplacement
    remplacer = function()
    {
        var j;
        var continuer;
        
        for(k = 0; k < niveau.tailleX; k++)
        {
            for(i = niveau.tailleY - 1; i >= 0; i--)
            {
                if(niveau.grille[k][i] == -1)
                {
                    j = i;
                    continuer = true;
                    while(j > 0 && continuer == true)
                    {
                        j--;
                        if(niveau.grille[k][j] != 0 && niveau.grille[k][j] != -1) // Si on trouve une case correcte, on remplace
                        {
                            niveau.grille[k][i] = niveau.grille[k][j];
                            niveau.grille[k][j] = -1;
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
                if(niveau.grille[i][k] == -1)
                {
                    niveau.grille[i][k] = rand(1, 5)|0;
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
    
    boucleDeJeu = function() {
        update(Date.now());  
        render();
        requestAnimationFrame(boucleDeJeu);
    }
    var inter;
    var enCours = false;
    /**
     *  Mise à jour de l'état du jeu
     *  @param  d   date courante
     */
    update = function(d) {
        if(estValide(caseCliquee(clic)) && niveau.finDuJeu == 0)
        {
            if(sontAdjacentes(niveau.caseADeplacer, caseCliquee(clic)) && !enCours)
            {
                console.log("On échange !");
                echanger(niveau.caseADeplacer, caseCliquee(clic));
                
                if(detecter()) // Si il n'y a pas de cases a detruire
                {
                    echanger(niveau.caseADeplacer, caseCliquee(clic)); // On reechange
                    niveau.caseADeplacer = caseCliquee(clic);
                }
                else
                {
                    enCours = true; // Pour ne pas jouer de coups tant qu'un autre est en cours
                    inter = setInterval(function()
                    {
                        detruire();
                        remplacer();
                        detecter();
                        
                        if(detecter())
                        {
                            clearInterval(inter);
                            niveau.nbCoups++;
                            enCours = false;
                        }
                    }, 1000);
                    
                    /*while(!detecter())
                    {
                        detruire();
                        remplacer();
                    }*/
                    
                    
                    // Pour ne pas qu'il y ait de cases cliquee apres un coup reussi
                    niveau.caseADeplacer.x = -1;
                    niveau.caseADeplacer.y = -1;
                    clic.x = -1;
                    clic.y = -1;
                }
            }
            else
            {
                niveau.caseADeplacer = caseCliquee(clic);
            }
        }
        
        document.getElementById("coups").innerHTML = 10 - niveau.nbCoups;
        document.getElementById("score").innerHTML = niveau.score;
        
        if(niveau.nbCoups >= 10 && niveau.score < 6000)
            niveau.finDuJeu = 2;
        else if(niveau.nbCoups >= 10 && niveau.score >= 6000)
            niveau.finDuJeu = 1;
    }
    
    
    /**
     *  Fonction réalisant le rendu de l'état du jeu
     */
    render = function() {
        // effacement de l'écran
        context.clearRect(0, 0, context.width, context.height);

        context.fillStyle="blue";

        affichageGrille();

        context.fillStyle="pink";
        affichageBonbons();
        affichageCasesADetruire();

        if(niveau.caseADeplacer.x != -1 && niveau.caseADeplacer.y != -1)
            affichageCaseSelec(niveau.caseADeplacer);
        
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

        console.log(event.keyCode);
        switch(event.keyCode)
        {
            case 38:
            case 90:
                touche.haut = true;
                break;
            case 37:
            case 81:
                touche.gauche = true;
                break;
            case 39:
            case 68:
                touche.droite = true;
                break;
            case 40:
            case 83:
                touche.bas = true;
                break;
        }
    }
    
    /**
     *  Fonction appelée lorsqu'une touche du clavier est relâchée
     *  Associée à l'événement "keyUp"
     */
    captureRelacheToucheClavier = function(event) {
        switch(event.keyCode)
        {
            case 38:
            case 90:
                touche.haut = false;
                break;
            case 37:
            case 81:
                touche.gauche = false;
                break;
            case 39:
            case 68:
                touche.droite = false;
                break;
            case 40:
            case 83:
                touche.bas = false;
                break;
        }
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