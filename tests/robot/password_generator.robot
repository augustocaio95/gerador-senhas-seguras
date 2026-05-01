*** Settings ***
Library     Process
Library     Collections
Library     String


*** Variables ***
${BRIDGE_SCRIPT}    tests/robot/password_bridge.mjs
${NODE_BIN}         node


*** Test Cases ***
Generate Password With Full Criteria
    ${options}=    Set Variable    {"length":12,"uppercase":true,"lowercase":true,"numbers":true,"symbols":true}
    ${result}=    Run Process    ${NODE_BIN}    ${BRIDGE_SCRIPT}    ${options}    shell=${False}
    Should Be Equal As Integers    ${result.rc}    0
    ${stdout}=    Strip String    ${result.stdout}
    ${ok}=    Evaluate    __import__("json").loads(r'''${stdout}''')["ok"]
    ${valid}=    Evaluate    __import__("json").loads(r'''${stdout}''')["valid"]
    ${length}=    Evaluate    __import__("json").loads(r'''${stdout}''')["length"]
    Should Be True    ${ok}
    Should Be True    ${valid}
    Should Be Equal As Integers    ${length}    12

Generate Password Lowercase Only
    ${options}=    Set Variable    {"length":12,"uppercase":false,"lowercase":true,"numbers":false,"symbols":false}
    ${result}=    Run Process    ${NODE_BIN}    ${BRIDGE_SCRIPT}    ${options}    shell=${False}
    Should Be Equal As Integers    ${result.rc}    0
    ${stdout}=    Strip String    ${result.stdout}
    ${password}=    Evaluate    __import__("json").loads(r'''${stdout}''')["password"]
    Should Match Regexp    ${password}    ^[a-z]+$

Invalid Configuration Should Fail
    ${options}=    Set Variable    {"length":10,"uppercase":false,"lowercase":false,"numbers":false,"symbols":false}
    ${result}=    Run Process    ${NODE_BIN}    ${BRIDGE_SCRIPT}    ${options}    shell=${False}
    Should Not Be Equal As Integers    ${result.rc}    0
    ${stdout}=    Strip String    ${result.stdout}
    ${ok}=    Evaluate    __import__("json").loads(r'''${stdout}''')["ok"]
    ${error}=    Evaluate    __import__("json").loads(r'''${stdout}''')["error"]
    Should Be Equal    ${ok}    ${False}
    Should Contain    ${error}    Select at least one character group

Randomness Sanity Check
    ${seen}=    Create List
    FOR    ${idx}    IN RANGE    250
        ${result}=    Run Process    ${NODE_BIN}    ${BRIDGE_SCRIPT}    {"length":12}    shell=${False}
        Should Be Equal As Integers    ${result.rc}    0
        ${stdout}=    Strip String    ${result.stdout}
        ${password}=    Evaluate    __import__("json").loads(r'''${stdout}''')["password"]
        Append To List    ${seen}    ${password}
    END
    ${unique_count}=    Evaluate    len(set($seen))
    Should Be True    ${unique_count} > 242
