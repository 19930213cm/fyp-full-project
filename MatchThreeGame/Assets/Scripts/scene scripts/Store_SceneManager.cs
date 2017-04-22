using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Store_SceneManager : MonoBehaviour {
    GameObject background;
    GameObject hearts;
    GameObject coins;
    public Text coinsText;
    public Text heartsText;

    // Use this for initialization
    void Start () {
        initHud(); 
	}
	
	// Update is called once per frame
	void Update () {
        updateHud(); 
    }

    void OnDestroy(){
    }
    void initHud()
    {
        background = GameObject.Find("candyBackground");
        coins = GameObject.Find("coins_0");
        hearts = GameObject.Find("heart");

        //DontDestroyOnLoad(hearts);
        //DontDestroyOnLoad(background);
        //DontDestroyOnLoad(coins);
        //DontDestroyOnLoad(heartsText);
        //DontDestroyOnLoad(coinsText);
        coinsText.text = "x" + PlayerVariables.getInt("currentCoins").ToString();
        heartsText.text = "x" + PlayerVariables.getInt("lives").ToString();
    }

    void updateHud()
    {
        coinsText.text = "x" + PlayerVariables.getInt("currentCoins").ToString();
        heartsText.text = "x" + PlayerVariables.getInt("lives").ToString();
    }

    public void refreshLives()
    {
        if (checkCost(Constants.refreshLives_Cost) && !isPlayerAtMaxLives())
        {
            PlayerVariables.PlayerJson.SetField("currentCoins", PlayerVariables.getInt("currentCoins") - Constants.refreshLives_Cost);
            int maxLives = PlayerVariables.getInt("maxLives");
            PlayerVariables.PlayerJson.SetField("lives", maxLives);
            nodeServerCalls.sendPlayerDoc();
        } 
        else
        {
            print("not enough coins or at max lives");
        }
    }

    public void increaseMaximumLives()
    {
        if (checkCost(Constants.increaseLives_Cost))
        {
            int lives = PlayerVariables.getInt("lives");
            PlayerVariables.PlayerJson.SetField("lives", (lives+1).ToString());

            PlayerVariables.PlayerJson.SetField("currentCoins", PlayerVariables.getInt("currentCoins") - Constants.increaseLives_Cost);
            int maxLives = PlayerVariables.getInt("maxLives");
            PlayerVariables.PlayerJson.SetField("maxLives", PlayerVariables.getInt("maxLives") + 1);
            nodeServerCalls.sendPlayerDoc();
        }
        else
        {
            print("not enough coins");
        }
    }

    bool checkCost(int cost)
    {
        if (PlayerVariables.getInt("currentCoins") >= cost)
        {
            return true; 
        }
        return false; 
    }

    bool isPlayerAtMaxLives()
    {
        int lives = PlayerVariables.getInt("lives");
        int maxLives = PlayerVariables.getInt("maxLives");
        if (lives == maxLives)
        {
            return true; 
        }
        return false; 

    }
}
