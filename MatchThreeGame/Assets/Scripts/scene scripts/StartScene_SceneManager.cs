using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using UnityEngine;
using UnityEngine.UI;

public class StartScene_SceneManager : MonoBehaviour
{
    GameObject background;
    GameObject hearts;
    GameObject coins;
    GameObject music;

    public Text coinsText;
    public Text heartsText;

    void Start()
    {
        nodeServerCalls.instantiatePlayerJson(); 
        initHud();
  
        print("yasen is a silly goose" + Constants.getemail()); 
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    //void instantiatePlayerJson()
    //{
    //    string mEmail = "christophertmartin1993@gmail.com";
    //    Debug.Log("email call:" + mEmail);
    //    JSONObject j = node.getPlayerDoc(mEmail);
    //    PlayerVariables.PlayerJson = j;
    //}


    void initHud()
    {
        background = GameObject.Find("candyBackground");
        coins = GameObject.Find("coins_0");
        hearts = GameObject.Find("heart");
        music= GameObject.Find("music");

        coins.SetActive(false);
        hearts.SetActive(false);

        DontDestroyOnLoad(hearts);
        DontDestroyOnLoad(background);
        DontDestroyOnLoad(coins);
        DontDestroyOnLoad(heartsText);
        DontDestroyOnLoad(coinsText);
        DontDestroyOnLoad(music);

        //Text cameraLabel = GameObject.Find("Canvas/Camera Label").GetComponent<Text>();
    }


    void OnDestroy()
    {
        print("Script was destroyed");
        coins.SetActive(true);
        hearts.SetActive(true);
    }

}

