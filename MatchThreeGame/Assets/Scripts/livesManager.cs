using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class livesManager : Singleton<livesManager> 
{
    float countdown;
    protected livesManager() { }
    static float time = Constants.lifeRechageTime;
    //public static bool shouldTimerTick = false;

    Text timer;
    int lives, maxLives;


    // Use this for initialization
    public void Start () {
        initTImer();
        updateLives();
        DontDestroyOnLoad(this);
        updateTimer();

    }
	
	// Update is called once per frame
	public void Update () {
        countdownToNextLife();
        updateLives();
        updateTimer();

    }

    void countdownToNextLife()
    {
        if (countdown <= 0)
        {
            int lives = PlayerVariables.getInt("lives");
            int maxLives = PlayerVariables.getInt("maxLives");

            //PlayerVariables.PlayerJson.SetField("lives", (lives + 1).ToString());
            //nodeServerCalls.sendPlayerDoc();
            
            nodeServerCalls.instantiatePlayerJson(); 
            if (lives < maxLives)
            {
                initTImer();
            } else
            {
                //lifeManagerTimer.shouldTimerTick = false; 
                Destroy(this); 
            }
            // + lives, send to server, pull from server, increase text of lives on page, if last life remove timer, if not run this again
        }
        countdown -= Time.deltaTime; 
    }

    void initTImer()
    {
        //countdown = Constants.lifeRechageTime;
        //lifeManagerTimer.shouldTimerTick = true; 
        //lifeManagerTimer.time = 3f;

        countdown = Constants.lifeRechageTime; 
    }

    void updateLives()
    {
        lives = PlayerVariables.getInt("lives");
        maxLives = PlayerVariables.getInt("maxLives");
    }
    bool livesNotEqualToMax()
    {
        if (lives < maxLives)
            return true;

        return false;
    }

    void updateTimer()
    {
        if (isTimerNull())
        {
            timer = GameObject.Find("Canvas/Timer").GetComponent<UnityEngine.UI.Text>();
        }

        if (livesNotEqualToMax())
        {
            time -= Time.deltaTime;
            string minutes = Mathf.Floor(time / 60).ToString("00");
            string seconds = (time % 60).ToString("00");
            timer.text = "next life in \n" + minutes + ":" + seconds;
            if (time <= 0)
                time = Constants.lifeRechageTime;
        }
        else
        {
            timer.text = "";
            Destroy(this);
        }



    }

    bool isTimerNull()
    {
        if (timer == null)
            return true;

        return false;
    }
}
