module Main exposing (ApiResponse, DisplayName, Model, Msg(..), decoder, displayNameDecoder, displayNameView, displayNamesView, errorView, footerView, handler, init, main, model, subscriptions, update, view)

import Html exposing (Html, a, br, div, footer, h1, img, li, span, text, ul)
import Html.Attributes exposing (class)
import Http
import Json.Decode exposing (bool, list, string)
import Markdown


type Msg
    = GotDisplayNames (List DisplayName)
    | GotError Http.Error


type alias Model =
    { displayNames : List DisplayName
    , error : Maybe String
    , loading : Bool
    }


type alias ApiResponse =
    { success : Bool
    , data : List DisplayName
    }


type alias DisplayName =
    { name : String }


model : Model
model =
    { displayNames = []
    , error = Nothing
    , loading = True
    }


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        GotDisplayNames displayNames ->
            ( { model | displayNames = displayNames, loading = False }, Cmd.none )

        GotError error ->
            ( { model | error = Just (Debug.toString error), loading = False }, Cmd.none )


view : Model -> Html Msg
view model =
    div []
        [ div [ class "main" ]
            [ h1 [] [ text "@ken_wheeler – also known as" ]
            , div [ class "since" ] [ text "Since 2018-06-27" ]
            , if model.loading == True then
                div [ class "loading" ] [ text "Loading..." ]

              else
                displayNamesView model.displayNames
            , errorView model.error
            ]
        , footer [] [ footerView ]
        ]


displayNamesView : List DisplayName -> Html msg
displayNamesView displayNames =
    displayNames
        |> List.reverse
        |> List.map displayNameView
        |> ul [ class "display-names" ]


displayNameView : DisplayName -> Html msg
displayNameView displayName =
    li [] [ text displayName.name ]


errorView : Maybe String -> Html msg
errorView error =
    case error of
        Just error ->
            text error

        Nothing ->
            text ""


footerView : Html msg
footerView =
    Markdown.toHtml [] """
* Built by [0lpeh](https://twitter.com/0lpeh)
* Repository available at [GitHub](https://github.com/olpeh/ken-wheeler-aka)
* Follow [@ken_wheeler_aka](https://twitter.com/ken_wheeler_aka)
"""


init : ( Model, Cmd Msg )
init =
    ( model
    , Http.send handler (Http.get "https://ken-wheeler-aka.herokuapp.com/api/aka/ken_wheeler" decoder)
    )


decoder : Json.Decode.Decoder ApiResponse
decoder =
    Json.Decode.map2 ApiResponse
        (Json.Decode.at [ "success" ] bool)
        (Json.Decode.at [ "data" ] (list displayNameDecoder))


displayNameDecoder : Json.Decode.Decoder DisplayName
displayNameDecoder =
    Json.Decode.map DisplayName
        (Json.Decode.field "name" Json.Decode.string)


handler : Result Http.Error ApiResponse -> Msg
handler result =
    case result of
        Ok apiResponse ->
            GotDisplayNames apiResponse.data

        Err error ->
            GotError error


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


main : Program Never Model Msg
main =
    Browser.document
        { view = view
        , init = init
        , update = update
        , subscriptions = subscriptions
        }
