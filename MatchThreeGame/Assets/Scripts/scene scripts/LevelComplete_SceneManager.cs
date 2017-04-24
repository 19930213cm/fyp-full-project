using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class LevelComplete_SceneManager : MonoBehaviour {
    Text newHighscore;
    Text scoreText;
    Text[] editTexts;
    GameObject coins;
    GameObject hearts ;
    // Use this for initialization
    void Start () {
        coins = GameObject.Find("coins_0");
        hearts = GameObject.Find("heart");
        initUi();
        sendHighscore();

    }

    // Update is called once per frame
    void Update () {

    }
    void initHud()
    {


        coins.SetActive(false);
        hearts.SetActive(false);
        //DontDestroyOnLoad(hearts);
        //DontDestroyOnLoad(background);
        //DontDestroyOnLoad(coins);
        //DontDestroyOnLoad(heartsText);
        //DontDestroyOnLoad(coinsText);



    }

    void OnDestroy()
    {
        hearts.SetActive(true);
        coins.SetActive(true);
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
