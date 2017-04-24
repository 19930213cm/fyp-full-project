using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameOver_SceneManager : MonoBehaviour {
    Text reasonText;
    GameObject coins ;
    GameObject hearts;
    // Use this for initialization
    void Start () {
        coins = GameObject.Find("coins_0");
        hearts = GameObject.Find("heart");
        getText();
        setText();
        initHud();
	}
	
	// Update is called once per frame
	void Update () {
		
	}


    void OnDestroy()
    {
        hearts.SetActive(true);
        coins.SetActive(true);
    }

    void getText()
    {
        GameObject canvas = GameObject.Find("Canvas");
        Text[] t = canvas.GetComponentsInChildren<Text>(); 
        reasonText = t[0]; 
    }

    void setText()
    {
        reasonText.text = "You ran out of moves"; 
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
}
