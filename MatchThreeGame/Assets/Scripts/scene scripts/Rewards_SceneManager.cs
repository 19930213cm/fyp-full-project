using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Rewards_SceneManager : MonoBehaviour {
    JSONObject obj = PlayerVariables.PlayerJson;
    public Button claimRewardButton;
    Text steps;
    Text gold;
    Text lives; 

    // Use this for initialization
    void Start () {
        //claimRewardButton = findClaimRewardButton();
        initScene();
        initText(); 

    }
	
	// Update is called once per frame
	void Update () {
		
	}

    void initText()
    {

        GameObject coins = GameObject.Find("coins_0");
        Debug.Log(coins.name); 
        coins.SetActive(true);
        Text[] obj = GameObject.Find("Canvas").GetComponentsInChildren<Text>();
        //foreach (Text t in obj)
        //{
        //    if (t.name == "steps")
        //}

        steps = GameObject.Find("steps").GetComponent<Text>();
        gold = GameObject.Find("gold").GetComponent<Text>();
        lives = GameObject.Find("lives").GetComponent<Text>();


        lives.text = PlayerVariables.getInt("lives").ToString();
        gold.text = PlayerVariables.getInt("currentCoins").ToString();
        steps.text = PlayerVariables.getInt("todaysSteps").ToString() + " / \n" +  Constants.goalSteps.ToString(); 

    }

    bool rewardHasBeenClaimed()
    {
        bool reward = PlayerVariables.getBool("dailyClaimed"); 
        if (reward)
        {
            return true; 
        }
        return false; 
    }

    static Button findClaimRewardButton()
    {
        Button[] buttons = GameObject.Find("Canvas").GetComponentsInChildren<Button>();
        for (int i = 0; i < buttons.Length; i++)
        {
            if (buttons[i].name == "ClaimReward")
            {
                return buttons[i];
            }
        }
        return buttons[0]; 
    }

    void initScene()
    {
        int playerSteps = PlayerVariables.getInt("todaysSteps");
        int targetSteps = Constants.goalSteps;

        if (rewardHasBeenClaimed())
        {
            //= this.GetComponentsInChildren<Button>();
            claimRewardButton.interactable = false;
            claimRewardButton.GetComponentInChildren<Text>().text = "Claimed for today";
            
        } else if(playerSteps >= targetSteps)
        {
            claimRewardButton.GetComponentInChildren<Text>().text = "ClaimReward";
        }
        else if (playerSteps > (targetSteps / 4) * 3)
        {
            claimRewardButton.interactable = false;
            claimRewardButton.GetComponentInChildren<Text>().text = "Almost there";

        }
        else if (playerSteps > (targetSteps / 4) * 2)
        {
            claimRewardButton.interactable = false;
            claimRewardButton.GetComponentInChildren<Text>().text = "Keep going";

        }
        else
        {
            claimRewardButton.interactable = false; 
            claimRewardButton.GetComponentInChildren<Text>().text = "You can do this";
        }
    } 

   public  void claimReward()
    {
        claimRewardButton.interactable = false;
        claimRewardButton.GetComponentInChildren<Text>().text = "Claimed for today";
        PlayerVariables.PlayerJson.SetField("dailyClaimed", true);
        int currentCoins = PlayerVariables.getInt("currentCoins");
        currentCoins += Constants.dailyReward;
        PlayerVariables.PlayerJson.SetField("currentCoins", currentCoins);
        nodeServerCalls.sendPlayerDoc(); 
        gold.text = currentCoins.ToString(); 

        //update coin counter if added to this scene
    }
}
