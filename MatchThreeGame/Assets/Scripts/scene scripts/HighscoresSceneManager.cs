﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;


public class HighscoresSceneManager : MonoBehaviour {
    Text[] textHighscores;
    JSONObject objHighscores;

    GameObject background;
    GameObject hearts;
    GameObject coins;
    public Text coinsText;
    public Text heartsText;

    // Use this for initialization
    void Start () {
        initUi();
        fetchHighscores();
        setTextFields();
        initHud(); 
    }
	
	// Update is called once per frame
	void Update () {
		
	}

    void OnDestroy()
    {
        background.SetActive(true);
        coins.SetActive(true);
        hearts.SetActive(true);
    }

    void setTextFields()
    {
 
        for (var i = 0; i < objHighscores.Count; i++)
        {
            textHighscores[i].text = ""; 
        }
            print(objHighscores[0].ToString());

        for (var i = 0; i < objHighscores.Count; i++)
        {
            string playerid = objHighscores[i].GetField("email").str;
            string[] playeridspl = playerid.Split('@'); 
            textHighscores[i].text = i + 1 + ". "; 
            textHighscores[i + (textHighscores.Length / 3)].text = playeridspl[0];
            textHighscores[i+ (textHighscores.Length /3 * 2)].text = objHighscores[i].GetField("score").i.ToString();
        }
    }
    void fetchHighscores()
    {
        objHighscores = nodeServerCalls.getHighscores(PlayerVariables.currentLevel);
        //[{"score":6000,"email":"dfd"},{"score":3000,"email":"b"},{"score":3000,"email":"n0393168@ntu.ac.uk"},{"score":2500,"email":"blach"},{"score":2000,"email":"a"}]
            }
    
    void initUi()
    {
        GameObject panel = GameObject.Find("hsPanel");
        textHighscores = panel.GetComponentsInChildren<Text>();


    }

    void initHud()
    {
        background = GameObject.Find("candyBackground");
        
        coins = GameObject.Find("coins_0");
        hearts = GameObject.Find("heart");
        coins.SetActive(false);
        hearts.SetActive(false);

        //DontDestroyOnLoad(hearts);
        //DontDestroyOnLoad(background);
        //DontDestroyOnLoad(coins);
        //DontDestroyOnLoad(heartsText);
        //DontDestroyOnLoad(coinsText);
        coinsText.text = "";
        heartsText.text = "";


    }
}
