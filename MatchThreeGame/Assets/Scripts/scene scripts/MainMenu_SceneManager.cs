using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MainMenu_SceneManager : MonoBehaviour
{
    GameObject background;
    GameObject hearts;
    GameObject coins;
    public Text coinsText;
    public Text heartsText;
    
    // Use this for initialization
    void Start()
    {
        initHud();

    }

    // Update is called once per frame
    void Update()
    {
        updateHud(); 
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
}
