using System.Collections;
using System.Collections.Generic;
using System.Net;
using UnityEngine;
using System;
using System.IO;
using UnityEngine.UI;

public class levelSelectSceneManager : MonoBehaviour {
    GameObject background;
    GameObject hearts;
    GameObject coins;
    public Text coinsText;
    public Text heartsText;

    string mEmail;  
    // Use this for initialization
    void Start () {
        nodeServerCalls.instantiatePlayerJson(); 
        canOpenLevel();

    }

    // Update is called once per frame
    void Update () {
        updateHud();

    }

    void OnDestroy()
    {
        background.SetActive(true);
    }

    void getPlayerEmail(string message)
    {
        if (message == "Ready")
        {
            AndroidJavaObject activity = new AndroidJavaObject("com.Company.chris.UnityPlayerActivity");
            mEmail = activity.Call<String>("getEmail");
            Debug.Log("recieved message");

        }
    } 

    bool checkHasLives()
    {
        string param = PlayerVariables.PlayerJson.GetField("lives").ToString();
        param = param.Replace("\"", "");
        int playerLives = int.Parse(param);

        if (playerLives > 0)
        {
            return true; 
        } else
        {
            return false; 
        }
    }

    void canOpenLevel()
    {
        Button[] buttons = GameObject.Find("Canvas").GetComponentsInChildren<Button>();

        if (checkHasLives())
        {
            string param = PlayerVariables.PlayerJson.GetField("currentLevel").ToString();
            param = param.Replace("\"", "");
            //int playersCurrentLevel = int.Parse(param);
            int playersCurrentLevel = PlayerVariables.getInt("currentLevel"); 

             //= this.GetComponentsInChildren<Button>(); 
            for (int i = playersCurrentLevel; i < buttons.Length; i++)
            {
                buttons[i].interactable = false;

            }
        } else
        {
            foreach (Button b in buttons)
            {
                b.interactable = false; 
                
            }

            buttons[buttons.Length - 1].interactable = true; 
        }

        //disable buttons
    } 

    //void instantiatePlayerJson()
    //{
    //    mEmail = "christophertmartin1993@gmail.com"; 
    //    Debug.Log("email call:" +  mEmail); 
    //    JSONObject j = node.getPlayerDoc(mEmail);
    //    PlayerVariables.PlayerJson = j;
    //}

    void initHud()
    {
        background = GameObject.Find("candyBackground");
        background.SetActive(false); 
        coins = GameObject.Find("coins_0");
        hearts = GameObject.Find("heart");

        //DontDestroyOnLoad(hearts);
        //DontDestroyOnLoad(background);
        //DontDestroyOnLoad(coins);
        //DontDestroyOnLoad(heartsText);
        //DontDestroyOnLoad(coinsText);
        coinsText.text =  PlayerVariables.getInt("currentCoins").ToString();
        heartsText.text =  PlayerVariables.getInt("lives").ToString();


    }


    void updateHud()
    {
        coinsText.text = PlayerVariables.getInt("currentCoins").ToString();
        heartsText.text = PlayerVariables.getInt("lives").ToString();
    }
}
