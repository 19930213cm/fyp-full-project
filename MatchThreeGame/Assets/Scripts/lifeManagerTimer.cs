//using System.Collections;
//using System.Collections.Generic;
//using UnityEngine;
//using UnityEngine.UI;

//public class lifeManagerTimer : Singleton<lifeManagerTimer>
//{
//    float countdown;
//    protected lifeManagerTimer() { }
//    static float time = Constants.lifeRechageTime;
//    //public static bool shouldTimerTick = false;
    
//    Text timer;
//    int lives, maxLives; 
    

//    // Use this for initialization
//    void Start () {
//        updateLives();
//        DontDestroyOnLoad(this); 
//        updateTimer();

//    }

//    // Update is called once per frame
//    void Update () {
//        updateLives(); 
//        updateTimer(); 

//    }

//    void updateLives()
//    {
//        lives = PlayerVariables.getInt("lives");
//        maxLives = PlayerVariables.getInt("maxLives");
//    }
//    bool livesNotEqualToMax()
//    {
//        print("lives " + lives);
//        print("mlives " + maxLives);

//        if (lives < maxLives)
//            return true;

//        return false; 
//    }
    
//    void updateTimer()
//    {
//        if (isTimerNull())
//        {
//            timer = GameObject.Find("Canvas/Timer").GetComponent<UnityEngine.UI.Text>();
//        } 

//        if (livesNotEqualToMax())
//        {
//            time -= Time.deltaTime;
//            string minutes = Mathf.Floor(time / 60).ToString("00");
//            string seconds = (time % 60).ToString("00");
//            timer.text = minutes + ":" + seconds;
//            if (time <= 0)
//                time = Constants.lifeRechageTime; 
//        }
//        else
//        {
//            timer.text = ""; 
//            Destroy(this);
//        }

       

//    }

//    bool isTimerNull()
//    {
//        if (timer == null)
//            return true;

//        return false; 
//    }
//}
