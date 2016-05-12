/**
 * Developpement de Candy Crush en Javascript
 * JEANNIN Emile - LAKHAL Mohamed
 */

/** Type agrégé niveau **/
var niveau = {
	x: 0,							// Position X de la grille dans le canvas
	y: 0,							// Position Y de la grille dans le canvas
	tailleX: 10,					// Nombre de colonnes de la grille
	tailleY: 10,					// Nombre de lignes de la grille
	tailleCase: 60,					// Taille (en px) de chaque case
	grille: [],						// Grille du jeu
	finDuJeu: 0,					// 0 si le jeu est encore en cours, 1 si le jeu est gagné, 2 si le jeu est perdu
	nbCoups: 0,						// Nombre d'actions effectuées par le joueur
	score: 0,						// Score du joueur : +60 à chaque case détruite
	caseADeplacer: {x: -1, y: -1}	// Case sélectionnée : à {-1, -1} si aucune
};

/** Pour connaître le score d'avant afin d'afficher la barre de progression correctement **/
var scorePrec = 0;

/** Pour savoir si un échange est en cours **/
var echangeEnCours = false;
/** ID de l'échange **/
var idDepl;

/** Coordonnées du clic dans la zone de jeu (relatives au canvas) **/
var clic = { x: -1, y: -1 };

/** Grille de destruction pour connaître les cases à détruire **/
var grilleDeDestruction = new Array();

/** Pour se souvenir des cases échangées pour le cas où il faut les rééchanger **/
var cs1, cs2;

/** Indique si on veut rééchanger les cases **/
var reechanger = false;

/** Indique si on veut 'casser' des cases (après un échange) **/
var casser = false;

/** Indique si un coup est en cours **/
var enCours = false;

/** Indique si une animation est en cours **/
var animation = false;

/** Temps précédent permettant de compter des temps **/
var tempsPrec = 0;

/** Permet d'identifier la phase d'initialisation pour le processus de remplacement **/
var initEnCours = false;

/**
 * Permet de faire avancer la barre de score
 * @param fin   Jusqu'à quel score on veut avancer
 */
function move(fin) {
    var elem = document.getElementById("bar");
    var largeur = scorePrec/6000*100;			// Transformation du score en pourcentage du max
    
    var id = setInterval(frame, 25);			// Pour faire avancer la barre progressivement
    function frame()
    {
        if (largeur >= fin)
        {
            clearInterval(id);
        } 
        else
        {
            largeur++;
            if(largeur >= 100)					// Si on dépasse 100%, on reste à 100%
            {
                largeur = 100;
                clearInterval(id);				// Puis on arrête
            }
            elem.style.width = largeur + '%';
            document.getElementById("label").innerHTML = (largeur|0) + '%';	// On change dans l'HTML, et on tronque pour ne pas avoir de virgule
        }
    }
    scorePrec = niveau.score;					// On met à jour le scorePrec pour recommencer où on s'était arrêté la fois suivante
}

/** Chargement des images des bonbons **/
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
 * Fonction qui regarde si deux cases sont côtes à côtes
 *
 * @param case1     La première case
 * @param case2     La seconde case
 * @return boolean  vrai si les cases sont adjacentes
 */
sontAdjacentes = function(case1, case2)
{
    //on vérifie si la tuile est sur une case adjacente (à côté) de la tuile selectionnée
    if ((Math.abs(case1.x - case2.x) == 1 && case1.y == case2.y) ||  (Math.abs(case1.y - case2.y) == 1 && case1.x == case2.x))
        return true;
    else
        return false;
}

/**
 * Echange les valeurs de deux cases et anime cet échange
 * 
 * @param case1   Première case
 * @param case2   Seconde case
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
    }
}

/**
 * Anime l'échange de deux cases
 *
 * @param case1		Première case
 * @param case2		Seconde case
 * @param enX		Indique si le déplacement s'effectue horizontalement
 * @param enY		Indique si le déplacement s'effectue verticalement
 * @param pos1		Position de la première case
 * @param pos2		Position de la seconde case
 */
depl = function(case1, case2, enX, enY, pos1, pos2)
{
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
        echangeEnCours = false;
        clearInterval(idDepl);
    }
}

/**
 * Vérifie la validité d'une case
 * @param cs 	la case à vérifier
 */
estValide = function(cs)
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
            niveau.grille[i][j] = { x: 0, y: 0, couleur: 0 };	// Chaque case contient sa valeur et sa position

            niveau.grille[i][j].x = i * niveau.tailleCase;		// Position en x de la case
            niveau.grille[i][j].y = j * niveau.tailleCase;		// Position en y de la case

            niveau.grille[i][j].couleur = rand(0, 5)|0; 		// Pour avoir des entiers
            if(niveau.grille[i][j].couleur == 0) 				// Pour avoir moins de cases vides
                niveau.grille[i][j].couleur = rand(0, 5)|0;
        }
    }
}

/**
 * Affichage d'un texte centre autour du point indiqué
 *
 * @param text 		Le texte à afficher
 * @param x 		La position en x
 * @param width     La largeur dans laquelle on veut centrer le texte
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
 * affichage des cases a detruire (surlignées en rouge)
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
            couleurBonbon(niveau.grille[i][j]);  // Afficher les bonbons correspondant à la valeur de la case
        }
    }
}

/**
 * Traçage des bonbons (les images)
 * 
 * @param caseEnCours	La case à afficher
 */
couleurBonbon = function(caseEnCours)
{
    switch(caseEnCours.couleur)
    {
    	// Case inutilisable
        case 0:
            context.drawImage(vide, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        // Case rouge
        case 1:
            context.drawImage(red, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        case 6:
            context.drawImage(redComboHoriz, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        case 11:
            context.drawImage(redComboVert, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        // Case bleue
        case 2:
            context.drawImage(blue, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        case 7:
            context.drawImage(blueComboHoriz, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        case 12:
            context.drawImage(blueComboVert, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        // Case verte
        case 3:
            context.drawImage(green, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        case 8:
            context.drawImage(greenComboHoriz, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        case 13:
            context.drawImage(greenComboVert, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        // Case orange
        case 4:
            context.drawImage(orange, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        case 9:
            context.drawImage(orangeComboHoriz, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        case 14:
            context.drawImage(orangeComboVert, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        // Case jaune
        case 5:
            context.drawImage(yellow, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        case 10:
            context.drawImage(yellowComboHoriz, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        case 15:
            context.drawImage(yellowComboVert, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        // Case combo
        case 16:
            context.drawImage(combo, niveau.x + caseEnCours.x+1, niveau.y + caseEnCours.y+1, niveau.tailleCase-2, niveau.tailleCase-2);
            break;
        // Autres
        default:
           	console.log("Erreur dans l'affichage : case indéterminée");
            break;
    }
}

/**
 * Affichage de la case selectionnée (surlignée en noir)
 *
 * @param caseSelec 	Case sélectionnée
 */
affichageCaseSelec = function(caseSelec)
{
    context.fillStyle="rgba(0, 0, 0, 0.3)";
    context.fillRect(niveau.tailleCase*caseSelec.x + niveau.x, niveau.tailleCase*caseSelec.y + niveau.y, niveau.tailleCase, niveau.tailleCase);
}

/**
 * Petite fonction aleatoire
 *
 * @param mini 		Borne minimum
 * @param maxi 		Borne maximum
 * @return real     Réel aléatoire entre mini et maxi
 */
rand = function(mini, maxi) {
    return (Math.random()*(maxi-mini+1))+mini;
}

/**
 * Detection des bonbons a detruire
 * 
 * @return boolean 		Vrai si il n'y a plus de cases à détruire
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
                couleurTemp -= 5;
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
                    couleurTemp -= 5;
                if(couleurTemp > 5)
                    couleurTemp -= 5;
                pasDeCasesADetruire = false;
                
            }
            else
            {
                nbCasesAlignees = 1;
                couleurTemp = niveau.grille[i][j].couleur;
                if(couleurTemp > 10)
                    couleurTemp -= 5;
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
            couleurTemp -= 5;
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
                    couleurTemp -= 5;
                if(couleurTemp > 5)
                    couleurTemp -= 5;
                pasDeCasesADetruire = false;
            }
            else
            {
                nbCasesAlignees = 1;
                couleurTemp = niveau.grille[i][j].couleur;
                if(couleurTemp > 10)
                    couleurTemp -= 5;
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
 *
 * @param i 				Colonne se trouvant après les cases à détruire
 * @param j 				Ligne où les cases à détruire se situent
 * @param nbCasesAlignees	Nombre de cases à détruire
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
 *
 * @param i 				Colonne où les cases à détruire se situent
 * @param j 				Ligne se trouvant après les cases à détruire
 * @param nbCasesAlignees	Nombre de cases à détruire
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
 * Destruction des cases précédement notées
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

/**
 * Remplace les bonbons détruit et en fait apparaître d'autres
 */
remplacer = function()
{
    var j;
    var continuer;
    var temp;
    var posMax;

    var uneCaseCorrecte = false;

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
                    	uneCaseCorrecte = true;
                    	if(initEnCours)
                    	{
                        	niveau.grille[k][i].couleur = niveau.grille[k][j].couleur;
                        	niveau.grille[k][j].couleur = -1;
                    	}
                        else
                        {
	                        temp = niveau.grille[k][i];
	                        niveau.grille[k][i] = niveau.grille[k][j];
	                        niveau.grille[k][j] = temp;

	                        // On place les nouvelles cases au dessus de la grille
	            			niveau.grille[k][j].y = niveau.y - niveau.tailleCase;
	                    }
                        continuer = false; // On n'a plus besoin de rechercher
                    }
                }
                if(!uneCaseCorrecte)
                	niveau.grille[k][i].y = niveau.y - niveau.tailleCase;
            }
        }
    }

    /*if(!initEnCours)
    {
        var nbMoinsUn = 0;
        for(k = 0; k < niveau.tailleX; k++)
        {
            nbMoinsUn = 0;
            for(i = niveau.tailleY - 1; i > 0; i--)
            {
                if(niveau.grille[k][i].couleur == -1)
                {
                    nbMoinsUn++;
                    niveau.grille[k][i].y == niveau.y - (niveau.tailleCase * nbMoinsUn);
                    console.log(niveau.y - (niveau.tailleCase * nbMoinsUn));
                }
            }
        }
        console.log("fin");
    }*/

    for(k = 0; k < niveau.tailleY; k++)
    {
        for(i = 0; i < niveau.tailleX; i++)
        {
            if(niveau.grille[i][k].couleur == -1)
            {
                niveau.grille[i][k].couleur = rand(1, 5)|0;
                // niveau.grille[i][k].couleur = 0;
            }
        }
    }
}

/**
 * Initialisation (ou réinitialisation)
 */  
init = function()
{
	initEnCours = true;

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

    document.addEventListener("click", captureClicSouris);

    tempsPrec = Date.now();
    
    boucleDeJeu();

    initEnCours = false;
}

/**
 * Mise a jour du jeu puis affichage
 */
boucleDeJeu = function() {
    update(Date.now());
    render();
    requestAnimationFrame(boucleDeJeu);
}

/**
 * Mise a jour du processus de detection, destruction, remplacement
 */
miseAJour = function()
{
    if(!animation)
    {
        detruire();
        remplacer();
            
        detecter();
        
        if(detecter() && pasDeCasesDetruites())
        {
            niveau.nbCoups++;
            enCours = false;
        }
    }
}

/**
 * Verifie qu'il n'y a pas de cases detruites
 *
 * @return boolean		Vrai si il n'y a plus de cases à détruire
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

/**
 * Indique si une animation est en cours (ou plutôt doit être en cours)
 *
 * @return boolean
 */
verifAnim = function()
{
	var i = 0;
    var j = 0;
	animation = false;

	while(i < niveau.tailleX && !animation)
    {
    	j = 0;
        while(j < niveau.tailleY && !animation)
        {
            if(niveau.grille[i][j].y != niveau.tailleCase*j + niveau.y)
                animation = true;
            j++;
        }
        i++;
    }

    return animation;
}

/**
 * Effectue le mouvement des pièces
 */
anim = function()
{
    var i = 0;
    var j = 0;

    for(i = 0; i < niveau.tailleX; i++)
    {
        for(j = 0; j < niveau.tailleY; j++)
        {

            if(niveau.grille[i][j].y > niveau.tailleCase*j + niveau.y)
                niveau.grille[i][j].y -= 10;
            else if(niveau.grille[i][j].y < niveau.tailleCase*j + niveau.y)
                niveau.grille[i][j].y += 10;
        }
    }
}

/**
 *  Mise à jour de l'état du jeu
 *  @param  d   date courante
 */
update = function(d)
{
	var dT = d - tempsPrec;

	if(!echangeEnCours && dT > 25 && verifAnim())
	{
		anim();
		tempsPrec = Date.now();
	}
	else if(!echangeEnCours && !animation && enCours && dT > 250)
	{
		miseAJour();
		tempsPrec = Date.now();
	}
	else if(!echangeEnCours && !enCours && !animation)
	{
	    if(estValide(caseCliquee(clic)) && niveau.finDuJeu == 0 && !animation)
	    {
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
	                tempsPrec = Date.now();
	                enCours = true;
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
	                    grilleDeDestruction[niveau.caseADeplacer.x][niveau.caseADeplacer.y] = true;
	                }

	                if(couleurDet > 10)
	                    couleurDet -= 5;
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

	                setTimeout(detruire, 200);
	                setTimeout(remplacer, 250);
	                tempsPrec = Date.now();
	                enCours = true;
	                // Pour ne pas qu'il y ait de cases cliquee apres un coup reussi
	                niveau.caseADeplacer.x = -1;
	                niveau.caseADeplacer.y = -1;
	                clic.x = -1;
	                clic.y = -1;
	            }
                else if(niveau.grille[niveau.caseADeplacer.x][niveau.caseADeplacer.y].couleur > 5 && niveau.grille[caseCliquee(clic).x][caseCliquee(clic).y].couleur > 5)
                {
                    for(i = 0; i < niveau.tailleX; i++)
                    {
                        grilleDeDestruction[i][niveau.caseADeplacer.y] = true;
                    }

                    for(i = 0; i < niveau.tailleX; i++)
                    {
                        grilleDeDestruction[niveau.caseADeplacer.x][i] = true;
                    }

                    tempsPrec = Date.now();
                    enCours = true;
                    // Pour ne pas qu'il y ait de cases cliquee apres un coup reussi
                    niveau.caseADeplacer.x = -1;
                    niveau.caseADeplacer.y = -1;
                    clic.x = -1;
                    clic.y = -1;
                }
	            else if(estValide(niveau.caseADeplacer))
	            {
	                cs1 = niveau.caseADeplacer;
	                cs2 = caseCliquee(clic);
	                echanger(niveau.caseADeplacer, caseCliquee(clic));

	                if(detecter() && !casser) // Si il n'y a pas de cases a detruire
		            {
		                reechanger = true; // On reechange
		            }
		            else // Si il y a des cases a detruire
		            {
		                casser = true;
		            }
	            }

	            clic.x = -1;
	        	clic.y = -1;
	        }
	        else
	        {
	            niveau.caseADeplacer = caseCliquee(clic);
	        }
	    }

	    if(reechanger && !echangeEnCours && !animation)
	    {
	        reechanger = false;
	        echanger(cs1, cs2);
	        niveau.caseADeplacer = caseCliquee(clic);
	    }

	    if(casser && !echangeEnCours && !enCours && !animation)
	    {
	    	tempsPrec = Date.now();
	        enCours = true;
	        // Pour ne pas qu'il y ait de cases cliquee apres un coup reussi
	        niveau.caseADeplacer.x = -1;
	        niveau.caseADeplacer.y = -1;
	        clic.x = -1;
	        clic.y = -1;
	        casser = false;
	    }
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

play = function(idPlayer, control) {
    var player = document.getElementById("audioPlayer");
    
    if (player.paused) {
        player.play();
        control.textContent = "Pause";
    } else {
        player.pause();
        control.textContent = "Play";
    }
}

stop = function(idPlayer) {
    var player = document.getElementById("audioPlayer");

    player.currentTime = 0;
    play.pause(); 
}



/**
 *  Fonction réalisant le rendu de l'état du jeu
 */
render = function()
{
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
    
        if(niveau.finDuJeu == 1) {
            drawCenterText("Tu as gagné !", niveau.x, niveau.y + (niveau.tailleCase * niveau.tailleY) / 2 + 10, niveau.tailleCase * niveau.tailleX);
        
        }
        else {
            drawCenterText("Tu as perdu...", niveau.x, niveau.y + (niveau.tailleCase * niveau.tailleY) / 2 + 10, niveau.tailleCase * niveau.tailleX);
        
        }
    }
}

gameover = function() {
    soundWin = document.getElementbyId("soundWin");
    soundLose = document.getElementbyId("soundLose");
    var soundWin = "win.ogg";
    var soundLose = "lose.mp3";

    if(niveau.finDuJeu == 1) {
        soundWin.play();
    }
    else if (niveau.finDuJeu == 2) {
        soundLose.play();
    }
}

/**
 *  Fonction appelée lorsque la souris bouge
 *  Associée à l'événement "click"
 */
captureClicSouris = function(event)
{
    // calcul des coordonnées de la souris dans le canvas
    if (event.target.id == "cvs") {
        clic.x = event.pageX - event.target.offsetLeft;
        clic.y = event.pageY - event.target.offsetTop;
    }
}
