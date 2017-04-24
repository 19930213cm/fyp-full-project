using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LevelComplete_SceneManager : MonoBehaviour {
    Text newHighscore;
    Text scoreText;
    Text[] editTexts; 
    // Use this for initialization
    void Start () {
        initUi();
        sendHighscore();

    }

    // Update is called once per frame
    void Update () {

    }

    void initUi()
    {
        GameObject canvas = GameObject.Find("editCanvas");
        editTexts = canvas.GetComponentsInChildren<Text>();
        scoreText = editTexts[0];
        newHighscore = editTexts[1]; 
    } 

    void sendHighscore()
    {

        if (PlayerVariables.newScore > PlayerVariables.getInt(PlayerVariables.currentLevel))
        {
            //send hs
            PlayerVariables.PlayerJson.SetField(PlayerVariables.currentLevel, PlayerVariables.newScore); 
            nodeServerCalls.sendHighscores(PlayerVariables.currentLevel, PlayerVariables.newScore);
            newHighscore.text = "New Highscore"; 
        }
        scoreText.text = PlayerVariables.getInt(PlayerVariables.currentLevel).ToString();

    }


}
